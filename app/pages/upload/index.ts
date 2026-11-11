// The page people land on: pick a file, watch it go up, copy the link.
//
// The page owns no upload logic. It builds the pieces of the screen once, then
// moves between five stages by showing and hiding them. Reading setStage() below
// tells you everything about what the screen can look like.

import { Base, Button, Div, H1, Input, P, Page, Span, waitFor } from '@codesuma/baseline'
import { toDataURL } from 'qrcode'
import { Progress } from '../../components/progress'
import { DropZone } from '../../components/drop-zone'
import * as api from '../../lib/api'
import { fileSize } from '../../lib/format'
import { discardUpload, resumableUpload, uploadFile } from '../../lib/upload'
import { consumeUploaderPassword, storeUploaderPassword } from '../../lib/uploader-password'
import { getRevocationToken, storeRevocationToken } from '../../lib/share-revocation'
import { createSiteNavigation } from '../../lib/site-navigation'
import { show } from '../../lib/show'
import { createPreferencesBar, t, translateUploadStatus } from '../../lib/preferences'
import styles from './index.module.css'

const ICONS = {
    fast: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    private: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    safe: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    resumable: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    simple: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    reliable: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    size: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>',
    expires: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
    password: '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>'
} as const

type IconName = keyof typeof ICONS

function icon(name: IconName): string {
    return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`
}

// The server enforces this too. Checking here only saves a pointless round trip
// and gives a faster answer.
const MAX_FILE_SIZE = 1024 * 1024 * 1024

type Stage = 'idle' | 'chosen' | 'uploading' | 'done' | 'failed'

export const UploadPage = () => {
    const page = Page()
    page.addClass('screen')
    const siteNavigation = createSiteNavigation()
    const preferencesBar = createPreferencesBar()

    const card = Div()
    card.addClass('card')

    // Put the product name in the main heading so the brand is immediately clear.
    const heading = H1('Linkify')
    heading.addClass('heading')

    // Keep the 1 GB limit and resumable-upload promise visible in the introduction.
    const intro = P(t('intro'))
    intro.addClass('intro')

    const benefitsWrap = Div()
    benefitsWrap.addClass('benefits-wrap')
    const benefitsTitle = Base('h2')
    benefitsTitle.addClass('benefits-title')
    benefitsTitle.text(t('benefitsTitle'))
    const benefits = Div()
    benefits.addClass('benefits')
    const benefitItems = [
        { icon: 'fast', title: t('fast'), text: t('fastDetail') },
        { icon: 'private', title: t('private'), text: t('privateDetail') },
        { icon: 'safe', title: t('safe'), text: t('safeDetail') },
        { icon: 'resumable', title: t('resumable'), text: t('resumableDetail') },
        { icon: 'simple', title: t('simple'), text: t('simpleDetail') },
        { icon: 'reliable', title: t('reliable'), text: t('reliableDetail') },
        { icon: 'size', title: '1 GB', text: 'Share files up to 1 GB' },
        { icon: 'expires', title: t('expiryLabel'), text: `${t('hour')} · ${t('day')} · ${t('week')}` },
        { icon: 'password', title: t('protect'), text: 'Add an optional access password' }
    ] as const
    for (const item of benefitItems) {
        const block = Div()
        block.addClass('benefit')
        const benefitIcon = Span('')
        benefitIcon.addClass('benefit-icon')
        benefitIcon.el.innerHTML = icon(item.icon)
        const heading = Base('strong')
        heading.addClass('benefit-title')
        heading.text(item.title)
        const detail = Span(item.text)
        detail.addClass('benefit-detail')
        block.append(benefitIcon, heading, detail)
        benefits.append(block)
    }
    benefitsWrap.append(benefitsTitle, benefits)

    // Explain Linkify's purpose and the core transfer behavior below the benefits.
    const aboutWrap = Div()
    aboutWrap.addClass('about-wrap')
    const aboutTitle = Base('h2')
    aboutTitle.addClass('about-title')
    aboutTitle.text(t('aboutTitle'))
    const aboutDescription = P(t('aboutDescription'))
    aboutDescription.addClass('about-description')
    const aboutLinks = Div()
    aboutLinks.addClass('about-links')
    for (const item of [
        { href: '/about.html', label: 'Meet Linkify' },
        { href: '/how-it-works.html', label: 'See how it works' }
    ]) {
        const link = Base('a')
        link.el.href = item.href
        link.el.target = '_blank'
        link.el.rel = 'noopener noreferrer'
        link.el.textContent = item.label
        aboutLinks.append(link)
    }
    aboutWrap.append(aboutTitle, aboutDescription, aboutLinks)

    // Offer only the three supported link lifetimes in a native accessible select.
    const expiryChoices: { value: api.LinkExpiry; label: string }[] = [
        { value: '1h', label: t('hour') },
        { value: '1d', label: t('day') },
        { value: '1w', label: t('week') }
    ]
    const expiryRow = Div()
    expiryRow.addClass(styles.expiryRow)
    const expiryLabel = Base('label')
    expiryLabel.addClass(styles.expiryLabel)
    expiryLabel.append(Span(t('expiryLabel')))
    const expirySelect = Base('select')
    expirySelect.addClass(styles.expirySelect)
    expirySelect.el.setAttribute('aria-label', t('expiryLabel'))
    for (const choice of expiryChoices) {
        const option = Base('option')
        option.el.setAttribute('value', choice.value)
        option.el.textContent = choice.label
        expirySelect.append(option)
    }
    expirySelect.el.value = '1h'
    expiryLabel.append(expirySelect)
    expiryRow.append(expiryLabel)

    // A password toggle lets the uploader choose whether a sensitive file should be
    // protected before the share link is created.
    const passwordRow = Div()
    passwordRow.addClass(styles.passwordRow)
    const passwordToggle = Input('', 'checkbox', { checked: false })
    passwordToggle.addClass(styles.passwordToggle)
    const passwordLabel = Base('label')
    passwordLabel.addClass(styles.passwordLabel)
    passwordLabel.append(passwordToggle, Span(t('protect')))
    const passwordInput = Input('', 'password')
    passwordInput.addClass(styles.passwordInput)
    passwordInput.el.setAttribute('placeholder', t('passwordPlaceholder'))
    passwordInput.el.setAttribute('aria-label', t('enterPassword'))
    passwordRow.append(passwordLabel, passwordInput)
    // Show password validation directly below the input that needs correction.
    const passwordError = P('')
    passwordError.addClass('error')
    passwordError.el.style.flexBasis = '100%'
    passwordError.el.style.boxSizing = 'border-box'
    passwordRow.append(passwordError)

    const dropZone = DropZone(t('dropTitle'), t('dropHint'))

    // Terms live directly under the upload field so an uploader has to agree before
    // a file can be selected or sent.
    const termsRow = Div()
    termsRow.addClass(styles.termsRow)
    const termsCheckbox = Input('', 'checkbox', { checked: false })
    termsCheckbox.addClass(styles.termsCheckbox)
    const termsLabel = Base('label')
    termsLabel.addClass(styles.termsLabel)
    const termsText = Span(`${t('agree')} `)
    const termsLink = Base('a')
    termsLink.el.href = '/terms.html'
    termsLink.el.target = '_blank'
    termsLink.el.rel = 'noopener noreferrer'
    termsLink.el.textContent = t('terms')
    const termsAnd = Span(` ${t('and')} `)
    const privacyLink = Base('a')
    privacyLink.el.href = '/privacy.html'
    privacyLink.el.target = '_blank'
    privacyLink.el.rel = 'noopener noreferrer'
    privacyLink.el.textContent = t('privacy')
    termsLabel.append(termsCheckbox, termsText, termsLink, termsAnd, privacyLink)
    termsRow.append(termsLabel)
    // Explain that consent is required and update the note as the checkbox changes.
    const termsHint = P(t('acceptBeforeUse'))
    termsHint.addClass('note')
    termsRow.append(termsHint)

    // The preview area shows a quick thumbnail or media snapshot for images, video,
    // and PDFs before the user shares the final link.
    const previewWrap = Div()
    previewWrap.addClass(styles.previewWrap)
    const previewMedia = Div()
    previewMedia.addClass(styles.previewMedia)
    previewWrap.append(previewMedia)

    // --- the chosen file -----------------------------------------------------

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

    const actions = Div()
    actions.addClass('actions')
    actions.append(uploadButton, discardButton)

    // --- while it runs -------------------------------------------------------

    const progress = Progress()

    const status = P('')
    status.addClass('status')

    // --- when it ends --------------------------------------------------------

    const shareInput = Input('', 'text', { readonly: true })
    shareInput.addClass(styles.shareInput)

    const copyButton = Button(t('copy'))
    copyButton.addClass('button', 'secondary')

    // Add a small action group so the finished share link can be opened in a new
    // tab or shown as a QR code for mobile scanning without leaving the current page.
    const openButton = Button(t('openLink'))
    openButton.addClass('button', 'secondary')

    // Open the dedicated media page without changing the share/download URL.
    const previewButton = Button(t('preview'))
    previewButton.addClass('button', 'secondary')

    // Keep the QR action visually compact while its accessible label names the action.
    const qrButton = Button('')
    qrButton.addClass('button', 'secondary', styles.qrButton)
    qrButton.el.setAttribute('aria-label', t('qrCodeTitle'))
    qrButton.el.title = t('qrCodeTitle')
    qrButton.el.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M3 3h7v7H3zM5 5v3h3V5zM14 3h7v7h-7zM16 5v3h3V5zM3 14h7v7H3zM5 16v3h3v-3z"/><path d="M13 13h3v3h-3zM18 13h3v2h-3zM17 16h2v2h-2zM13 18h2v3h-2zM16 19h2v2h-2zM20 17h1v4h-1z"/></svg>'

    const shareActions = Div()
    shareActions.addClass(styles.shareActions)
    shareActions.append(copyButton, openButton, previewButton, qrButton)

    const shareRow = Div()
    shareRow.addClass(styles.shareRow)
    shareRow.append(shareInput, shareActions)

    // Keep a dedicated popup for the generated QR code so users can scan it from
    // a phone while the desktop browser still shows the share link and controls.
    const qrModal = Div()
    qrModal.addClass('qr-modal', 'hidden')
    const qrDialog = Div()
    qrDialog.addClass('qr-dialog')
    const qrTitle = Base('h3')
    qrTitle.addClass('qr-title')
    qrTitle.text(t('qrCodeTitle'))
    const qrImage = Base('img')
    qrImage.addClass('qr-image')
    qrImage.el.alt = t('qrCodeTitle')
    const qrCloseButton = Button(t('close'))
    qrCloseButton.addClass('button', 'secondary')
    qrDialog.append(qrTitle, qrImage, qrCloseButton)
    qrModal.append(qrDialog)

    // The revoke action uses an inline modal instead of browser.confirm() so the
    // destructive flow stays inside the app, keeps the same visual language, and
    // gives a clear cancel path before the share link is permanently disabled.
    const revokeConfirmModal = Div()
    revokeConfirmModal.addClass('revoke-modal', 'hidden')
    const revokeConfirmDialog = Div()
    revokeConfirmDialog.addClass('revoke-dialog')
    const revokeConfirmTitle = Base('h3')
    revokeConfirmTitle.addClass('revoke-title')
    revokeConfirmTitle.text(t('confirmRevoke'))
    // This message explains the real impact of the revoke action before the HTTP
    // request is sent, so the user understands that the link stops working for
    // everyone who has it and that the action is not reversible in the browser.
    const revokeConfirmText = P(t('revokeWarning'))
    revokeConfirmText.addClass('revoke-message')
    const revokeConfirmActions = Div()
    revokeConfirmActions.addClass('revoke-actions')
    const cancelRevokeButton = Button(t('close'))
    cancelRevokeButton.addClass('button', 'secondary')
    const confirmRevokeButton = Button(t('revokeLink'))
    confirmRevokeButton.addClass('button', 'danger')
    revokeConfirmActions.append(cancelRevokeButton, confirmRevokeButton)
    revokeConfirmDialog.append(revokeConfirmTitle, revokeConfirmText, revokeConfirmActions)
    revokeConfirmModal.append(revokeConfirmDialog)

    // Confirm the selected expiration beside the completed share link.
    const expirySummary = P('')
    expirySummary.addClass('status')

    const error = P('')
    error.addClass('error')

    const retryButton = Button(t('tryAgain'))
    retryButton.addClass('button', 'primary')

    const againButton = Button(t('sendAnother'))
    againButton.addClass('button', 'secondary')

    const revokeButton = Button(t('revokeLink'))
    revokeButton.addClass('button', 'secondary', 'danger')

    const endActions = Div()
    endActions.addClass('actions')
    endActions.append(retryButton, revokeButton, againButton)

    card.append(heading, intro, expiryRow, passwordRow, dropZone, previewWrap, fileRow, resumeNote, actions, termsRow, progress, status, shareRow, expirySummary, error, endActions)
    page.append(siteNavigation, preferencesBar, card, benefitsWrap, aboutWrap, qrModal, revokeConfirmModal)

    // --- state ---------------------------------------------------------------

    let chosen: File | null = null
    let canResume = false
    let previewUrl: string | null = null
    let currentShareUrl = ''
    let currentRevocationToken = ''
    let revocationTokenSaved = true
    let linkRevoked = false
    // Keep viewer URLs identical to the public share link.
    function uploaderLink(value: string): URL {
        const link = new URL(value)
        link.searchParams.delete('password')
        return link
    }

    // Clear any stale tab password and navigate in place; every viewer must ask for the password.
    function openViewer(url: URL): void {
        const match = /^\/f\/([^/]+)/.exec(url.pathname)
        if (!match) {
            throw new Error('The file viewer URL is not valid')
        }

        storeUploaderPassword(match[1], '')
        window.location.href = url.toString()
    }

    // Restore the completed-upload view when returning from a file viewer.
    page.on('enter', async () => {
        const params = new URLSearchParams(window.location.search)
        const completedLink = params.get('completed')
        if (!completedLink) return

        try {
            const shareUrl = new URL(completedLink)
            const match = /^\/f\/([^/]+)$/.exec(shareUrl.pathname)
            if (shareUrl.origin !== window.location.origin || !match) {
                throw new Error('The saved share link is not valid')
            }

            // Consume the restoration URL so refreshing returns to a clean upload page.
            window.history.replaceState(null, '', '/')
            currentShareUrl = `${shareUrl.origin}${shareUrl.pathname}${shareUrl.search}`
            shareInput.setValue(currentShareUrl)
            currentRevocationToken = getRevocationToken(match[1]) ?? ''

            const ownerPassword = consumeUploaderPassword(match[1]) ?? ''
            const file = await api.fileInfo(match[1], ownerPassword || undefined, shareUrl)
            chosen = null
            canResume = false
            fileName.text(file.fileName)
            fileMeta.text(fileSize(file.size))
            expirySummary.text(t('linkExpiresAt', {
                date: new Date(Number(shareUrl.searchParams.get('expires')) * 1000).toLocaleString()
            }))
            show(previewButton, true)
            setStage('done')
        } catch (problem) {
            heading.text(t('nothingHere'))
            error.text(problem instanceof Error ? problem.message : t('linkDidNotWork'))
            setStage('failed')
        }
    })

    function updateUploadAvailability() {
        const enabled = termsCheckbox.el.checked
        dropZone.setDisabled(!enabled)
        show(termsHint, !enabled)
        uploadButton.el.disabled = !enabled
        uploadButton.el.setAttribute('aria-disabled', String(!enabled))
        if (!enabled) {
            uploadButton.el.title = t('acceptBeforeUpload')
        } else {
            uploadButton.el.title = ''
        }
    }

    function setStage(stage: Stage) {
        show(dropZone, stage === 'idle')
        show(expiryRow, stage === 'idle' || stage === 'chosen')
        show(passwordRow, stage === 'idle' || stage === 'chosen')
        show(termsRow, stage === 'idle' || stage === 'chosen')
        show(previewWrap, stage === 'chosen' || stage === 'uploading')
        show(fileRow, stage !== 'idle')
        show(resumeNote, stage === 'chosen' && canResume)
        show(actions, stage === 'chosen')
        show(discardButton, canResume)
        show(progress, stage === 'uploading')
        show(status, stage === 'uploading')
        show(shareRow, stage === 'done')
        show(expirySummary, stage === 'done')
        show(error, stage === 'failed')
        show(endActions, stage === 'done' || stage === 'failed')
        show(retryButton, stage === 'failed')
        retryButton.text(canResume ? t('resumeUpload') : t('tryAgain'))
        show(revokeButton, stage === 'done' && Boolean(currentRevocationToken) && !linkRevoked)
    }

    function resetPreview() {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            previewUrl = null
        }
        previewMedia.el.innerHTML = ''
    }

    function renderPreview(file: File) {
        resetPreview()
        const type = file.type || ''

        if (type.startsWith('image/')) {
            const image = Base('img')
            image.el.src = URL.createObjectURL(file)
            image.el.alt = file.name
            previewMedia.append(image)
            previewUrl = image.el.src
            return
        }

        if (type.startsWith('video/')) {
            const video = Base('video')
            video.el.src = URL.createObjectURL(file)
            video.el.controls = true
            video.el.muted = true
            previewMedia.append(video)
            previewUrl = video.el.src
            return
        }

        if (type === 'application/pdf') {
            const frame = Base('iframe')
            frame.el.src = URL.createObjectURL(file)
            frame.el.title = file.name
            frame.el.setAttribute('sandbox', 'allow-scripts allow-same-origin')
            previewMedia.append(frame)
            previewUrl = frame.el.src
        }
    }

    async function choose(file: File) {
        if (!termsCheckbox.el.checked) {
            error.text(t('acceptBeforeSelect'))
            setStage('failed')
            show(fileRow, false)
            show(retryButton, false)
            resetPreview()
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            chosen = null
            error.text(t('tooLarge', { name: file.name, size: fileSize(file.size) }))
            setStage('failed')
            show(fileRow, false)
            show(retryButton, false)
            resetPreview()
            return
        }

        chosen = file
        canResume = Boolean(await resumableUpload(file))

        fileName.text(file.name)
        fileMeta.text(fileSize(file.size))
        uploadButton.text(canResume ? t('continueUpload') : t('upload'))
        renderPreview(file)

        setStage('chosen')
    }

    async function run() {
        if (!chosen) return

        if (!termsCheckbox.el.checked) {
            error.text(t('acceptBeforeUpload'))
            setStage('failed')
            return
        }

        const password = passwordToggle.el.checked ? passwordInput.value().trim() : undefined
        if (passwordToggle.el.checked && !password) {
            passwordError.text(t('passwordRequired'))
            show(passwordError, true)
            return
        }
        if (password !== undefined && (password.length < 6 || password.length > 128)) {
            passwordError.text(t(password.length < 6 ? 'passwordTooShort' : 'passwordTooLong'))
            show(passwordError, true)
            return
        }
        show(passwordError, false)

        const expiresIn = (expirySelect.el as HTMLSelectElement).value as api.LinkExpiry
        // Clear any earlier result before this upload starts so actions cannot reuse a stale link.
        currentShareUrl = ''
        currentRevocationToken = ''
        linkRevoked = false
        shareInput.setValue('')
        expirySummary.text('')
        error.text('')
        show(error, false)
        if (canResume) progress.prepareResume()
        else progress.reset()
        status.text(t('preparingUpload'))
        setStage('uploading')

        try {
            const finished = await uploadFile(chosen, {
                onStatus: message => status.text(translateUploadStatus(message)),
                onProgress: report => progress.update(report.uploadedBytes, report.totalBytes)
            }, expiresIn, password)

            currentShareUrl = finished.url
            currentRevocationToken = finished.revocationToken
            revocationTokenSaved = storeRevocationToken(finished.id, finished.revocationToken)
            shareInput.setValue(currentShareUrl)
            // Every completed upload can open its dedicated preview or download page.
            show(previewButton, true)
            const expiryText = t('expirySummary', { duration: expiryChoices.find(choice => choice.value === expiresIn)?.label ?? '' })
            expirySummary.text(revocationTokenSaved ? expiryText : `${expiryText} ${t('revocationNotSaved')}`)
            canResume = false
            setStage('done')
        } catch (problem) {
            const message = problem instanceof Error ? problem.message : t('uploadFailed')
            error.text(message)
            try {
                canResume = Boolean(await resumableUpload(chosen))
            } catch (resumeProblem) {
                canResume = false
                const detail = resumeProblem instanceof Error ? resumeProblem.message : t('uploadFailed')
                error.text(`${message} (${detail})`)
            }
            setStage('failed')
        }
    }

    dropZone.on('file', (file: File) => { void choose(file) })
    uploadButton.on('click', () => {
        if (!termsCheckbox.el.checked) {
            error.text(t('acceptBeforeUpload'))
            setStage('failed')
            return
        }
        void run()
    })
    retryButton.on('click', () => { void run() })

    // The modal opens before the HTTP revoke request so the user can decide to
    // abort the destructive action without accidentally disabling the link.
    revokeButton.on('click', () => {
        if (!currentRevocationToken || linkRevoked) return

        const match = /^\/f\/([^/]+)/.exec(new URL(currentShareUrl).pathname)
        if (!match) return

        show(revokeConfirmModal, true)
    })

    // The actual revocation request only runs after the user confirms in the app's
    // own dialog, keeping the destructive action visible and consistent with the
    // rest of the upload flow.
    confirmRevokeButton.on('click', async () => {
        const match = /^\/f\/([^/]+)/.exec(new URL(currentShareUrl).pathname)
        if (!currentRevocationToken || linkRevoked || !match) {
            show(revokeConfirmModal, false)
            return
        }

        show(revokeConfirmModal, false)
        revokeButton.el.disabled = true
        try {
            await api.revokeShareLink(match[1], currentRevocationToken)
            linkRevoked = true
            currentRevocationToken = ''
            expirySummary.text(t('linkRevoked'))
            show(revokeButton, false)
        } catch (problem) {
            error.text(problem instanceof Error ? problem.message : t('uploadFailed'))
            show(error, true)
        } finally {
            revokeButton.el.disabled = false
        }
    })

    cancelRevokeButton.on('click', () => show(revokeConfirmModal, false))
    revokeConfirmModal.el.addEventListener('click', (event) => {
        if (event.target === revokeConfirmModal.el) show(revokeConfirmModal, false)
    })

    discardButton.on('click', async () => {
        if (!chosen) return
        // The note is gone either way, so the page starts fresh even after a failure.
        const problem: unknown = await discardUpload(chosen).catch((reason: unknown) => reason)
        canResume = false
        uploadButton.text(t('upload'))
        setStage('chosen')
        if (problem) {
            error.text(problem instanceof Error ? problem.message : t('uploadFailed'))
            show(error, true)
        }
    })

    againButton.on('click', () => {
        chosen = null
        canResume = false
        currentShareUrl = ''
        currentRevocationToken = ''
        linkRevoked = false
        shareInput.setValue('')
        expirySummary.text('')
        error.text('')
        show(error, false)
        progress.reset()
        passwordToggle.el.checked = false
        passwordInput.setValue('')
        termsCheckbox.el.checked = false
        updateUploadAvailability()
        show(qrModal, false)
        show(revokeConfirmModal, false)
        resetPreview()
        setStage('idle')
    })

    // Copying a fresh share link uses the browser clipboard, and a textarea
    // fallback when the clipboard is missing or blocked. The button text changes
    // to "Copied" to confirm the action immediately.
    copyButton.on('click', async () => {
        const value = currentShareUrl
        if (!value) return

        try {
            await navigator.clipboard.writeText(value)
        } catch {
            const area = document.createElement('textarea')
            area.value = value
            area.setAttribute('readonly', 'true')
            area.style.position = 'fixed'
            area.style.left = '-9999px'
            document.body.append(area)
            area.select()
            document.execCommand('copy')
            area.remove()
        }

        copyButton.text(t('copied'))
        await waitFor(1500)
        copyButton.text(t('copy'))
    })

    // Open the existing public share page in the reusable viewer tab.
    openButton.on('click', () => {
        const value = currentShareUrl
        if (!value) return
        try {
            openViewer(uploaderLink(value))
        } catch (problem) {
            error.text(problem instanceof Error ? problem.message : t('uploadFailed'))
            show(error, true)
        }
    })

    // Reuse the signed share-link query while routing to the dedicated preview screen.
    previewButton.on('click', () => {
        const value = currentShareUrl
        if (!value) return
        const previewLink = uploaderLink(value)
        previewLink.pathname = `${previewLink.pathname}/preview`
        try {
            openViewer(previewLink)
        } catch (problem) {
            error.text(problem instanceof Error ? problem.message : t('uploadFailed'))
            show(error, true)
        }
    })

    // The QR popup keeps mobile scanning easy without hiding the desktop share link.
    // The code is drawn here in the browser. The share link is the key to the
    // file, so it must never go to an outside service just to make a picture.
    qrButton.on('click', async () => {
        const value = currentShareUrl
        if (!value) return
        qrImage.el.src = await toDataURL(value, { width: 220 })
        show(qrModal, true)
    })

    qrCloseButton.on('click', () => show(qrModal, false))
    qrModal.el.addEventListener('click', (event) => {
        if (event.target === qrModal.el) show(qrModal, false)
    })

    termsCheckbox.el.addEventListener('change', () => {
        updateUploadAvailability()
        if (termsCheckbox.el.checked) {
            error.text('')
            show(error, false)
        }
    })

    passwordToggle.el.addEventListener('change', () => {
        show(passwordInput, passwordToggle.el.checked)
        show(passwordError, false)
        if (!passwordToggle.el.checked) passwordInput.setValue('')
    })
    // Clear the required-password message as soon as a value is entered.
    passwordInput.el.addEventListener('input', () => {
        if (passwordInput.value().trim()) show(passwordError, false)
    })
    show(passwordInput, false)
    show(passwordError, false)
    updateUploadAvailability()
    setStage('idle')

    return page
}
