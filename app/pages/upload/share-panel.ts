// The finished link: a box to copy it from, and buttons to copy it, open it,
// preview the file, or show the link as a QR code for a phone to scan.

import { Base, Button, Div, Input, P, waitFor } from '@codesuma/baseline'
import { toDataURL } from 'qrcode'
import { t } from '../../lib/i18n'
import { getLinkAnalytics } from '../../lib/api'
import { show } from '../../lib/show'
import { storeUploaderPassword } from '../../lib/uploader-password'
import { Dialog } from './dialog'
import styles from './share-panel.module.css'

export const SharePanel = (onError: (message: string) => void) => {
    const input = Input('', 'text', { readonly: true })
    input.addClass(styles.input)

    const copyButton = Button(t('copy'))
    copyButton.addClass('button', 'secondary')

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

    const analyticsButton = Button(t('analytics'))
    analyticsButton.addClass('button', 'secondary')

    const actions = Div()
    actions.addClass(styles.actions)
    actions.append(copyButton, openButton, previewButton, analyticsButton, qrButton)

    const base = Div()
    base.addClass(styles.row)
    base.append(input, actions)

    // The QR code is drawn here in the browser. The share link is the key to the
    // file, so it must never go to an outside service just to make a picture.
    const qrDialog = Dialog(t('qrCodeTitle'))
    const qrImage = Base('img')
    qrImage.addClass(styles.qrImage)
    qrImage.el.alt = t('qrCodeTitle')
    const qrClose = Button(t('close'))
    qrClose.addClass('button', 'secondary')
    qrDialog.panel.append(qrImage, qrClose)

    const analyticsDialog = Dialog(t('analytics'))
    const analyticsStatus = P('')
    analyticsStatus.addClass('note')
    const analyticsGrid = Div()
    analyticsGrid.addClass(styles.analyticsGrid)
    const analyticsClose = Button(t('close'))
    analyticsClose.addClass('button', 'secondary')
    analyticsDialog.panel.append(analyticsStatus, analyticsGrid, analyticsClose)

    let link = ''

    // Keep viewer URLs identical to the public share link.
    function viewerUrl(): URL {
        const url = new URL(link)
        url.searchParams.delete('password')
        return url
    }

    // Clear any stale tab password and navigate in place; every viewer must ask for the password.
    function openViewer(url: URL) {
        const match = /^\/f\/([^/]+)/.exec(url.pathname)
        if (!match) {
            onError('The file viewer URL is not valid')
            return
        }
        storeUploaderPassword(match[1], '')
        window.location.href = url.toString()
    }

    // Copying uses the browser clipboard, and a textarea fallback when the
    // clipboard is missing or blocked. The button says "Copied" to confirm it.
    copyButton.on('click', async () => {
        if (!link) return
        try {
            await navigator.clipboard.writeText(link)
        } catch {
            const area = document.createElement('textarea')
            area.value = link
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

    openButton.on('click', () => {
        if (link) openViewer(viewerUrl())
    })

    previewButton.on('click', () => {
        if (!link) return
        const url = viewerUrl()
        url.pathname = `${url.pathname}/preview`
        openViewer(url)
    })

    qrButton.on('click', async () => {
        if (!link) return
        qrImage.el.src = await toDataURL(link, { width: 220 })
        qrDialog.open()
    })

    qrClose.on('click', qrDialog.close)
    analyticsClose.on('click', analyticsDialog.close)

    analyticsButton.on('click', async () => {
        if (!link) return
        const shareUrl = new URL(link)
        const match = /^\/f\/([^/]+)$/.exec(shareUrl.pathname)
        if (!match) return

        analyticsStatus.text(t('analyticsLoading'))
        analyticsGrid.el.replaceChildren()
        analyticsDialog.open()
        try {
            const result = await getLinkAnalytics(match[1], shareUrl)
            const remaining = Math.max(0, new Date(result.expiresAt).getTime() - Date.now())
            const minutes = Math.ceil(remaining / 60000)
            const timeLeft = minutes >= 60
                ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
                : `${minutes}m`
            analyticsStatus.text('')
            analyticsGrid.append(
                analyticsMetric(t('analyticsViews'), String(result.views)),
                analyticsMetric(t('analyticsUniqueVisitors'), String(result.uniqueVisitors)),
                analyticsMetric(t('analyticsDownloads'), String(result.downloads)),
                analyticsMetric(t('analyticsTimeLeft'), timeLeft)
            )
        } catch (problem) {
            analyticsGrid.el.replaceChildren()
            analyticsStatus.text(problem instanceof Error ? problem.message : t('analyticsUnavailable'))
        }
    })

    function analyticsMetric(label: string, value: string) {
        const metric = Div()
        metric.addClass(styles.analyticsMetric)
        const number = Base('strong')
        number.text(value)
        const name = Base('span')
        name.text(label)
        metric.append(number, name)
        return metric
    }

    return Object.assign(base, {
        // The page puts the dialog at its top level, over everything else.
        dialog: qrDialog,
        analyticsDialog,
        // A link that holds several files has no preview page of its own.
        setLink(url: string, previewable: boolean) {
            link = url
            input.setValue(url)
            show(previewButton, previewable)
        },
        clear() {
            link = ''
            input.setValue('')
            qrDialog.close()
            analyticsDialog.close()
        }
    })
}
