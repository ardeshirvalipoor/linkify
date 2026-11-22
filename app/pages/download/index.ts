// What someone sees when they open a share link.
//
// The page shows what the file is before anyone commits to downloading a
// gigabyte, then sends them to the server, which redirects the browser to the
// storage. The bytes never come through our machine.

import { Base, Button, Div, H1, Input, P, Page, IRouteEvent } from '@codesuma/baseline'
import { DropZone } from '../../components/drop-zone'
import { TermsField } from '../../components/terms-field'
import { CollectionInfo, fileInfo } from '../../lib/api'
import { fileSize } from '../../lib/format'
import { languageLocale, t, translateUploadStatus } from '../../lib/i18n'
import { createPreferencesBar } from '../../lib/preferences'
import { createSiteNavigation } from '../../lib/site-navigation'
import { show } from '../../lib/show'
import { finishFile, sendFile } from '../../lib/upload'
import { CollectionList } from './collection-list'

export const DownloadPage = () => {
    const page = Page()
    page.addClass('screen')
    const siteNavigation = createSiteNavigation()
    const preferencesBar = createPreferencesBar()

    const card = Div()
    card.addClass('card')

    const heading = H1(t('loading'))
    heading.addClass('heading')

    const meta = P('')
    meta.addClass('intro')

    // Supported preview types are displayed here before the browser decides to
    // download the file. This keeps the share page useful without forcing a full
    // file transfer before the user confirms the link.
    const previewWrap = Div()
    previewWrap.el.style.display = 'none'
    previewWrap.el.style.margin = '12px 0'
    previewWrap.el.style.maxWidth = '100%'
    previewWrap.el.style.textAlign = 'center'

    const previewMedia = Div()
    previewMedia.el.style.display = 'flex'
    previewMedia.el.style.alignItems = 'center'
    previewMedia.el.style.justifyContent = 'center'
    previewMedia.el.style.minHeight = '180px'
    previewMedia.el.style.borderRadius = '10px'
    previewMedia.addClass('download-preview-media')
    previewWrap.append(previewMedia)

    // A link that holds several files lists them instead of showing a preview.
    const collectionFiles = CollectionList()
    show(collectionFiles, false)

    const passwordWrap = Div()
    passwordWrap.el.style.display = 'none'
    passwordWrap.el.style.margin = '12px 0'
    passwordWrap.el.style.display = 'flex'
    passwordWrap.el.style.gap = '8px'
    passwordWrap.el.style.flexWrap = 'wrap'
    show(passwordWrap, false)

    const passwordInput = Input('', 'password')
    passwordInput.el.setAttribute('placeholder', t('enterPassword'))
    passwordInput.el.setAttribute('aria-label', t('enterPassword'))
    passwordInput.el.style.flex = '1'
    passwordInput.el.style.minWidth = '180px'
    const unlockButton = Button(t('unlock'))
    unlockButton.addClass('button', 'secondary')
    passwordWrap.append(passwordInput, unlockButton)
    // Keep incorrect-password feedback in the visible password section for retry.
    const passwordError = P('')
    passwordError.addClass('error')
    // Give password failures a full row beneath the input and unlock control.
    passwordError.el.style.flexBasis = '100%'
    passwordWrap.append(passwordError)

    // Anyone holding a live link can add files to it. They accept the terms
    // first, the same as on the upload page.
    const liveAddWrap = Div()
    liveAddWrap.addClass('live-exchange-add')
    show(liveAddWrap, false)
    const liveAddTitle = Base('strong')
    liveAddTitle.text(t('addFilesTitle'))
    const liveAddZone = DropZone(t('addFilesDrop'), t('addFilesHint'))
    liveAddZone.setDisabled(true)
    const liveAddTerms = TermsField(accepted => liveAddZone.setDisabled(adding || !accepted))
    const liveAddStatus = P('')
    liveAddStatus.addClass('note')
    liveAddWrap.append(liveAddTitle, liveAddZone, liveAddTerms, liveAddStatus)

    const downloadButton = Button(t('download'))
    downloadButton.addClass('button', 'primary')

    const actions = Div()
    actions.addClass('actions')
    actions.append(downloadButton)

    const error = P('')
    error.addClass('error')

    card.append(heading, meta, previewWrap, collectionFiles, passwordWrap, liveAddWrap, actions, error)
    page.append(siteNavigation, preferencesBar, card)

    let downloadPath = ''
    let currentId = ''
    let previewUrl: string | null = null
    let unlockedPassword: string | undefined
    let liveExchangeId: string | null = null
    let adding = false
    let refreshTimer: number | undefined

    function resetPreview() {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            previewUrl = null
        }
        previewMedia.el.innerHTML = ''
    }

    function renderPreview(file: { contentType: string; fileName: string; size: number; protected: boolean }, previewSource: string) {
        resetPreview()
        const type = file.contentType || ''

        if (type.startsWith('image/')) {
            const image = Base('img')
            image.el.src = previewSource
            image.el.alt = file.fileName
            image.el.style.maxWidth = '100%'
            image.el.style.maxHeight = '280px'
            previewMedia.append(image)
            previewWrap.el.style.display = 'block'
            return
        }

        if (type.startsWith('video/')) {
            const video = Base('video')
            video.el.src = previewSource
            video.el.controls = true
            video.el.muted = true
            video.el.style.maxWidth = '100%'
            video.el.style.maxHeight = '280px'
            previewMedia.append(video)
            previewWrap.el.style.display = 'block'
            return
        }

        if (type === 'application/pdf') {
            const frame = Base('iframe')
            frame.el.src = previewSource
            frame.el.title = file.fileName
            frame.el.style.width = '100%'
            frame.el.style.height = '300px'
            frame.el.style.border = '0'
            previewMedia.append(frame)
            previewWrap.el.style.display = 'block'
        }
    }

    async function loadFile(id: string, password?: string) {
        show(actions, false)
        show(error, false)
        show(passwordWrap, false)
        show(passwordError, false)
        show(collectionFiles, false)
        show(liveAddWrap, false)
        collectionFiles.clear()
        heading.text(t('loading'))
        meta.text('')
        resetPreview()

        try {
            const file = await fileInfo(id, password)
            currentId = file.id
            if (file.protected && !password) {
                heading.text(t('protectedTitle'))
                meta.text(t('protectedPrompt'))
                show(passwordWrap, true)
                return
            }

            // Hide password controls after the supplied password has been accepted.
            show(passwordWrap, false)
            if (password) unlockedPassword = password
            const expiryDate = linkExpiryDate()

            if ('files' in file) {
                heading.text(t('chooseFile'))
                showCollection(file, password)
                return
            }

            heading.text(file.fileName)
            meta.text(`${fileSize(file.size)} · ${t('linkExpiresAt', { date: expiryDate })}`)
            liveExchangeId = null

            const query = new URLSearchParams(window.location.search)
            if (password) query.set('password', password)
            else query.delete('password')
            downloadPath = `/api/files/${file.id}/download?${query.toString()}`
            // Preview requests get inline disposition and do not enter download logs.
            const previewPath = `/api/files/${file.id}/preview?${query.toString()}`
            renderPreview(file, previewPath)
            show(actions, true)
        } catch (problem) {
            if (problem instanceof Error && problem.message.toLowerCase().includes('password')) {
                heading.text(t('protectedTitle'))
                meta.text(t('protectedPrompt'))
                show(passwordWrap, true)
                if (password) {
                    passwordError.text(problem.message)
                    show(passwordError, true)
                }
                return
            }

            heading.text(t('nothingHere'))
            error.text(problem instanceof Error ? problem.message : t('linkDidNotWork'))
            show(error, true)
        }
    }

    // When the link stops working, from the expiry signed into it.
    function linkExpiryDate(): string {
        const expiresAt = Number(new URLSearchParams(window.location.search).get('expires'))
        return new Date(expiresAt * 1000).toLocaleString(languageLocale())
    }

    // The files in a link that holds several, and the add box when it is live.
    function showCollection(file: CollectionInfo, password?: string) {
        const totalSize = file.files.reduce((total, item) => total + item.size, 0)
        meta.text(`${fileSize(totalSize)} · ${t('linkExpiresAt', { date: linkExpiryDate() })}`)
        liveExchangeId = file.live ? file.id : null
        show(liveAddWrap, file.live)
        collectionFiles.render(file.id, file.files, password)
        show(collectionFiles, true)
    }

    // Picks up files that others added, without blanking the page first.
    async function refreshCollection(id: string) {
        const file = await fileInfo(id, unlockedPassword).catch(() => null)
        if (file && 'files' in file) showCollection(file, unlockedPassword)
    }

    // The router hands the page a fresh `enter` event every time someone
    // navigates here, with the :id from the address bar in params.
    page.on('enter', async ({ params }: IRouteEvent) => {
        // Every viewer, including the uploader's own Open action, must unlock protected files.
        await loadFile(params.id)
        // Others may add files to a live link, so its list refreshes while the page is open.
        window.clearInterval(refreshTimer)
        refreshTimer = window.setInterval(() => {
            if (liveExchangeId && !adding) void refreshCollection(liveExchangeId)
        }, 5 * 60 * 1000)
    })

    page.on('exit', () => window.clearInterval(refreshTimer))

    unlockButton.on('click', async () => {
        const password = passwordInput.value().trim()
        if (!password) {
            passwordError.text(t('pleaseEnterPassword'))
            show(passwordError, true)
            return
        }
        show(passwordError, false)
        unlockedPassword = password
        await loadFile(currentId || (new URL(location.href).pathname.split('/').pop() ?? ''), password)
    })

    downloadButton.on('click', () => {
        // A normal navigation, not fetch(). The server answers with a redirect,
        // the browser follows it to the storage, and the download bar appears
        // like it would for any other link.
        window.location.href = downloadPath
    })

    // Sends the files one after another into the open link. A failure is kept
    // and shown at the end, so a later file's progress cannot hide it.
    liveAddZone.on('files', async (files: File[]) => {
        const id = liveExchangeId
        if (!id || adding) return
        const params = new URLSearchParams(window.location.search)
        const expires = params.get('expires')
        const signature = params.get('signature')
        if (!expires || !signature) {
            liveAddStatus.text(t('linkIncomplete'))
            return
        }

        adding = true
        liveAddZone.setDisabled(true)
        liveAddStatus.removeClass('error')
        const failures: string[] = []
        const onStatus = (message: string) => liveAddStatus.text(translateUploadStatus(message))
        for (const file of files) {
            liveAddStatus.text(t('addingFile', { name: file.name }))
            try {
                const token = await sendFile(file, { onStatus, onProgress: () => undefined })
                // The link's own deadline replaces the expiry given here.
                await finishFile(file, token, onStatus, '1h', unlockedPassword, { id, expires, signature })
            } catch (problem) {
                failures.push(`${t('fileNotAdded', { name: file.name })} ${problem instanceof Error ? problem.message : ''}`.trim())
            }
        }

        await refreshCollection(id)
        liveAddStatus.text(failures.length ? failures.join(' ') : t('filesAdded'))
        liveAddStatus.toggleClass('error', failures.length > 0)
        adding = false
        liveAddZone.setDisabled(!liveAddTerms.accepted())
    })

    return page
}
