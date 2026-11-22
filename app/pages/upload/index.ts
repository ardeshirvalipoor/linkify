// The page people land on: pick files, watch them go up, copy the link.
//
// The page owns no upload logic. lib/upload-queue.ts sends the files, and the
// other files in this folder each draw one part of the screen. The page builds
// them once, then moves between six stages by showing and hiding them. Reading
// setStage() below tells you everything about what the screen can look like.

import { Button, Div, H1, P, Page } from '@codesuma/baseline'
import { DropZone } from '../../components/drop-zone'
import { Progress } from '../../components/progress'
import { TermsField } from '../../components/terms-field'
import * as api from '../../lib/api'
import { fileSize } from '../../lib/format'
import { t, translateUploadStatus } from '../../lib/i18n'
import { createPreferencesBar } from '../../lib/preferences'
import { getRevocationToken, storeRevocationToken } from '../../lib/share-revocation'
import { show } from '../../lib/show'
import { createSiteNavigation } from '../../lib/site-navigation'
import { discardUpload, resumableUpload } from '../../lib/upload'
import { createUploadQueue, MAX_FILES, QueueItem } from '../../lib/upload-queue'
import { consumeUploaderPassword } from '../../lib/uploader-password'
import { About } from './about'
import { Benefits } from './benefits'
import { ExpiryField } from './expiry-field'
import { FilePreview } from './file-preview'
import { LiveField } from './live-field'
import { PasswordField } from './password-field'
import { PauseButton } from './pause-button'
import { QueueList } from './queue-list'
import { RevokeControl } from './revoke-control'
import { SharePanel } from './share-panel'
import { Toast } from './toast'
import styles from './index.module.css'

type Stage = 'idle' | 'chosen' | 'uploading' | 'paused' | 'done' | 'failed'

export const UploadPage = () => {
    const page = Page()
    page.addClass('screen')

    const card = Div()
    card.addClass('card')

    // Put the product name in the main heading so the brand is immediately clear.
    const heading = H1('Linkify')
    heading.addClass('heading')

    // Keep the 1 GB limit and resumable-upload promise visible in the introduction.
    const intro = P(t('intro'))
    intro.addClass('intro')

    const expiry = ExpiryField()
    const password = PasswordField()
    const live = LiveField()
    const dropZone = DropZone(t('dropTitle'), t('dropHint'))
    const queueList = QueueList()
    const preview = FilePreview()
    const terms = TermsField(accepted => {
        updateUploadAvailability()
        if (accepted) show(error, false)
    })

    // --- the file being sent -------------------------------------------------

    const fileName = Div()
    fileName.addClass(styles.fileName)

    const fileMeta = Div()
    fileMeta.addClass(styles.fileMeta)

    const fileRow = Div()
    fileRow.addClass(styles.fileRow)
    fileRow.append(fileName, fileMeta)

    const resumeNote = P(t('resumeNote'))
    resumeNote.addClass('note')

    const uploadButton = Button(t('upload'))
    uploadButton.addClass('button', 'primary')

    const discardButton = Button(t('discard'))
    discardButton.addClass('button', 'secondary')

    const pauseButton = PauseButton()

    const actions = Div()
    actions.addClass('actions')
    actions.append(uploadButton, discardButton, pauseButton)

    // --- while it runs -------------------------------------------------------

    const progress = Progress()

    const status = P('')
    status.addClass('status')

    // --- when it ends --------------------------------------------------------

    const error = P('')
    error.addClass('error')
    const showError = (message: string) => {
        error.text(message)
        show(error, true)
    }

    const share = SharePanel(showError)

    // Confirm the selected expiration beside the completed share link.
    const expirySummary = P('')
    expirySummary.addClass('status')

    const revoke = RevokeControl(() => {
        expirySummary.text(t('linkRevoked'))
        show(revoke, false)
    }, showError)

    const retryButton = Button(t('tryAgain'))
    retryButton.addClass('button', 'primary')

    const againButton = Button(t('sendAnother'))
    againButton.addClass('button', 'secondary')

    const endActions = Div()
    endActions.addClass('actions')
    endActions.append(retryButton, revoke, againButton)

    const toast = Toast()

    card.append(heading, intro, expiry, password, live, dropZone, queueList, preview, fileRow, resumeNote, actions, terms, progress, status, share, expirySummary, error, endActions)
    page.append(createSiteNavigation(), createPreferencesBar(), card, Benefits(), About(), share.dialog, revoke.dialog)

    // --- state ---------------------------------------------------------------

    const queue = createUploadQueue()
    let stage: Stage = 'idle'
    // Whether the next file to send has an earlier upload to continue.
    let canResume = false
    // The file the progress bar measures. Going on with the same file keeps the
    // bar where it was, and a new file starts it again from its own position.
    let progressFile: File | null = null

    function setStage(next: Stage) {
        stage = next
        const choosing = stage === 'idle' || stage === 'chosen'
        const running = stage === 'uploading' || stage === 'paused'
        show(dropZone, choosing)
        // The file row already shows one file, so the list only appears for more.
        show(queueList, queue.items.length > 1)
        queueList.render(queue.items)
        show(expiry, choosing)
        show(password, choosing)
        show(live, choosing)
        show(terms, choosing)
        show(preview, stage === 'chosen' || running)
        show(fileRow, stage !== 'idle')
        show(resumeNote, stage === 'chosen' && canResume)
        show(actions, stage === 'chosen' || running)
        show(uploadButton, stage === 'chosen')
        show(discardButton, stage === 'chosen' && canResume)
        show(pauseButton, running)
        pauseButton.setPaused(stage === 'paused')
        show(progress, running)
        show(status, running)
        show(share, stage === 'done')
        show(expirySummary, stage === 'done')
        show(error, stage === 'failed')
        show(endActions, stage === 'done' || stage === 'failed')
        show(retryButton, stage === 'failed' || (stage === 'done' && queue.items.some(item => item.status === 'failed')))
        retryButton.text(canResume ? t('resumeUpload') : t('tryAgain'))
        show(revoke, stage === 'done' && revoke.canRevoke())
    }

    function updateUploadAvailability() {
        const enabled = terms.accepted()
        dropZone.setDisabled(!enabled)
        uploadButton.el.disabled = !enabled
        uploadButton.el.setAttribute('aria-disabled', String(!enabled))
        uploadButton.el.title = enabled ? '' : t('acceptBeforeUpload')
    }

    function showFile(file: File) {
        fileName.text(file.name)
        fileMeta.text(fileSize(file.size))
        preview.render(file)
    }

    // Restore the completed-upload view when returning from a file viewer.
    page.on('enter', async () => {
        const completedLink = new URLSearchParams(window.location.search).get('completed')
        if (!completedLink) return

        try {
            const shareUrl = new URL(completedLink)
            const match = /^\/f\/([^/]+)$/.exec(shareUrl.pathname)
            if (shareUrl.origin !== window.location.origin || !match) {
                throw new Error('The saved share link is not valid')
            }

            // Consume the restoration URL so refreshing returns to a clean upload page.
            window.history.replaceState(null, '', '/')
            const id = match[1]
            share.setLink(`${shareUrl.origin}${shareUrl.pathname}${shareUrl.search}`, true)
            const token = getRevocationToken(id)
            if (token) revoke.set(id, token)

            const ownerPassword = consumeUploaderPassword(id) ?? ''
            const file = await api.fileInfo(id, ownerPassword || undefined, shareUrl)
            if ('files' in file) {
                window.location.replace(shareUrl.toString())
                return
            }
            fileName.text(file.fileName)
            fileMeta.text(fileSize(file.size))
            expirySummary.text(t('linkExpiresAt', {
                date: new Date(Number(shareUrl.searchParams.get('expires')) * 1000).toLocaleString()
            }))
            setStage('done')
        } catch (problem) {
            heading.text(t('nothingHere'))
            error.text(problem instanceof Error ? problem.message : t('linkDidNotWork'))
            setStage('failed')
        }
    })

    async function chooseFiles(files: File[]) {
        if (!terms.accepted()) {
            error.text(t('acceptBeforeSelect'))
            setStage('failed')
            show(fileRow, false)
            show(retryButton, false)
            preview.clear()
            return
        }

        const refused = queue.add(files)
        if (refused.tooLarge) toast.notify(t('tooLarge', { name: refused.tooLarge.name, size: fileSize(refused.tooLarge.size) }), 'error')
        else if (refused.tooMany) toast.notify(t('tooManyFiles', { max: MAX_FILES }), 'error')

        const first = queue.items[0]
        if (!first) return
        const resumable = Boolean(await resumableUpload(first.file))
        // The person may have pressed Upload while the browser looked this up.
        if (stage !== 'idle' && stage !== 'chosen') return

        canResume = resumable
        showFile(first.file)
        uploadButton.text(canResume ? t('continueUpload') : t('upload'))
        setStage('chosen')
    }

    // Starts the queue, and carries on with it after a pause or a failure.
    async function start() {
        if (queue.running() || queue.items.length === 0) return

        if (!terms.accepted()) {
            error.text(t('acceptBeforeUpload'))
            setStage('failed')
            return
        }

        const chosenPassword = password.read()
        if (chosenPassword === null) return

        // Clear any earlier result before this upload starts so actions cannot reuse a stale link.
        share.clear()
        revoke.clear()
        expirySummary.text('')
        error.text('')
        status.text(t('preparingUpload'))
        setStage('uploading')

        const result = await queue.run({
            expiresIn: expiry.value(),
            password: chosenPassword,
            live: live.checked(),
            onItem: itemChanged,
            onStatus: message => status.text(translateUploadStatus(message)),
            onProgress: report => progress.update(report.uploadedBytes, report.totalBytes)
        })

        if (result.paused) {
            status.text(t('uploadPaused'))
            setStage('paused')
            return
        }

        const unfinished = queue.items.find(item => !item.link)
        canResume = Boolean(unfinished && await resumableUpload(unfinished.file))

        if (!result.link) {
            error.text(result.error ?? t('uploadFailed'))
            setStage('failed')
            return
        }

        const revocationTokenSaved = storeRevocationToken(result.link.id, result.link.revocationToken)
        // Only a one-file link that is not live has a preview page of its own.
        share.setLink(result.link.url, !live.checked() && queue.items.filter(item => item.link).length === 1)
        revoke.set(result.link.id, result.link.revocationToken)
        const expiryText = t('expirySummary', { duration: expiry.label() })
        expirySummary.text(revocationTokenSaved ? expiryText : `${expiryText} ${t('revocationNotSaved')}`)
        setStage('done')
    }

    function itemChanged(item: QueueItem) {
        queueList.render(queue.items)

        if (item.status === 'uploading') {
            if (item.file === progressFile) {
                progress.prepareResume()
            } else {
                progressFile = item.file
                showFile(item.file)
                progress.reset()
            }
        }

        if (item.status === 'complete') toast.notify(t('uploadSuccess', { name: item.file.name }), 'success')
        if (item.status === 'failed') toast.notify(t('uploadFailure', { name: item.file.name }), 'error')
    }

    // Leaving would stop the upload, so the browser asks first.
    window.addEventListener('beforeunload', event => {
        if (!queue.running()) return
        event.preventDefault()
        event.returnValue = ''
    })

    dropZone.on('files', (files: File[]) => { void chooseFiles(files) })
    uploadButton.on('click', () => { void start() })
    retryButton.on('click', () => { void start() })

    pauseButton.on('click', () => {
        if (stage === 'paused') void start()
        else queue.pause()
    })

    discardButton.on('click', async () => {
        const first = queue.items[0]
        if (!first) return
        // The note is gone either way, so the page starts fresh even after a failure.
        const problem: unknown = await discardUpload(first.file).catch((reason: unknown) => reason)
        canResume = false
        uploadButton.text(t('upload'))
        setStage('chosen')
        if (problem) showError(problem instanceof Error ? problem.message : t('uploadFailed'))
    })

    againButton.on('click', () => {
        queue.clear()
        canResume = false
        progressFile = null
        share.clear()
        revoke.clear()
        expirySummary.text('')
        error.text('')
        toast.dismiss()
        progress.reset()
        password.reset()
        live.reset()
        terms.reset()
        updateUploadAvailability()
        preview.clear()
        setStage('idle')
    })

    updateUploadAvailability()
    setStage('idle')

    return page
}
