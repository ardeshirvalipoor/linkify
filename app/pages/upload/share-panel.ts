// The finished link: a box to copy it from, and buttons to copy it, open it,
// preview the file, or show the link as a QR code for a phone to scan.

import { Base, Button, Div, Input, P, waitFor } from '@codesuma/baseline'
import { toDataURL } from 'qrcode'
import { t } from '../../lib/i18n'
import {
    deleteExchangeReceivedFile,
    getExchangeDashboard,
    getLinkAnalytics,
    revokeShareLink,
    updateExchangeSettings,
    type ExchangeActivity,
    type FileInfo
} from '../../lib/api'
import { getRevocationToken } from '../../lib/share-revocation'
import { fileSize } from '../../lib/format'
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

    const manageButton = Button(t('exchangeDashboard'))
    manageButton.addClass('button', 'secondary')
    show(manageButton, false)

    const actions = Div()
    actions.addClass(styles.actions)
    actions.append(copyButton, openButton, previewButton, analyticsButton, manageButton, qrButton)

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

    const dashboardDialog = Dialog(t('exchangeDashboard'))
    const dashboardStatus = P('')
    const dashboardName = Base('strong')
    dashboardName.addClass(styles.dashboardName)
    const dashboardExpiry = P('')
    dashboardExpiry.addClass(styles.dashboardExpiry)
    const dashboardLink = Input('', 'text', { readonly: true })
    dashboardLink.addClass(styles.dashboardLink)
    const sharedTitle = Base('h4')
    sharedTitle.addClass(styles.sectionTitle)
    sharedTitle.text(t('sharedFiles'))
    const sharedList = Div()
    const receivedTitle = Base('h4')
    receivedTitle.addClass(styles.sectionTitle)
    receivedTitle.text(t('receivedFiles'))
    const receivedList = Div()
    const activityTitle = Base('h4')
    activityTitle.addClass(styles.sectionTitle)
    activityTitle.text(t('activityHistory'))
    const activityList = Div()

    const settingsTitle = Base('h4')
    settingsTitle.addClass(styles.settingsTitle)
    settingsTitle.text(t('uploadSettings'))
    const nameInput = Input('', 'text')
    nameInput.addClass(styles.settingsInput)
    nameInput.el.placeholder = t('exchangeNamePlaceholder')
    nameInput.el.setAttribute('aria-label', t('exchangeName'))
    const liveToggle = Input('', 'checkbox')
    liveToggle.addClass(styles.settingsToggle)
    const liveTrack = Base('span')
    liveTrack.addClass(styles.settingsSwitchTrack)
    const liveThumb = Base('span')
    liveThumb.addClass(styles.settingsSwitchThumb)
    liveTrack.append(liveToggle, liveThumb)
    const liveLabel = Base('label')
    liveLabel.addClass(styles.toggleLabel)
    liveLabel.append(liveTrack, Base('span'))
    liveLabel.el.lastElementChild!.textContent = t('letOthersAdd')
    const passwordInput = Input('', 'password')
    passwordInput.addClass(styles.settingsInput)
    passwordInput.el.placeholder = t('passwordPlaceholder')
    const saveSettings = Button(t('saveSettings'))
    saveSettings.addClass('button', 'primary')
    const closeExchange = Button(t('closeExchange'))
    closeExchange.addClass('button', 'danger')
    const dashboardClose = Button(t('close'))
    dashboardClose.addClass('button', 'secondary')

    const settingsCard = Div()
    settingsCard.addClass(styles.settingsCard)
    settingsCard.append(settingsTitle, nameInput, liveLabel, passwordInput, saveSettings)
    const dashboardActions = Div()
    dashboardActions.addClass(styles.dashboardActions)
    dashboardActions.append(closeExchange, dashboardClose)
    dashboardDialog.panel.append(
        dashboardName, dashboardStatus, dashboardLink, dashboardExpiry,
        sharedTitle, sharedList, receivedTitle, receivedList,
        settingsCard,
        activityTitle, activityList, dashboardActions
    )

    let link = ''
    let dashboardIsLive = false
    let dashboardId = ''

    async function refreshDashboard() {
        if (!dashboardId) return
        const token = getRevocationToken(dashboardId)
        if (!token) {
            dashboardStatus.text(t('revocationNotSaved'))
            return
        }
        dashboardStatus.text(t('loading'))
        try {
            const result = await getExchangeDashboard(dashboardId, token)
            dashboardName.text(result.name || t('unnamedExchange'))
            dashboardLink.setValue(link)
            dashboardExpiry.text(`${t('linkExpiresAt', { date: new Date(result.expiresAt).toLocaleString() })}`)
            nameInput.setValue(result.name || '')
            liveToggle.el.checked = result.live
            passwordInput.setValue('')
            renderFileList(sharedList, result.sharedFiles, false)
            renderFileList(receivedList, result.receivedFiles, true)
            renderActivity(result.activity)
            dashboardStatus.text('')
        } catch (problem) {
            dashboardStatus.text(problem instanceof Error ? problem.message : t('dashboardUnavailable'))
        }
    }

    function renderFileList(container: ReturnType<typeof Div>, files: FileInfo[], deletable: boolean) {
        container.el.replaceChildren()
        if (files.length === 0) {
            container.append(P(t('noFiles')))
            return
        }
        for (const file of files) {
            const row = Div()
            row.addClass(styles.dashboardFile)
            const label = P(`${file.fileName} · ${fileSize(file.size)}`)
            row.append(label)
            if (deletable) {
                const remove = Button(t('deleteFile'))
                remove.addClass('button', 'secondary')
                remove.on('click', async () => {
                    const token = getRevocationToken(dashboardId)
                    if (!token) return
                    await deleteExchangeReceivedFile(dashboardId, file.id, token)
                    await refreshDashboard()
                })
                row.append(remove)
            }
            container.append(row)
        }
    }

    function renderActivity(activity: ExchangeActivity[]) {
        activityList.el.replaceChildren()
        if (activity.length === 0) {
            activityList.append(P(t('noActivity')))
            return
        }
        for (const item of activity) {
            const row = P(`${new Date(item.createdAt).toLocaleString()} · ${item.details || item.action}`)
            activityList.append(row)
        }
    }

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
    dashboardClose.on('click', dashboardDialog.close)

    manageButton.on('click', async () => {
        if (!dashboardId) return
        dashboardDialog.open()
        await refreshDashboard()
    })

    saveSettings.on('click', async () => {
        const token = getRevocationToken(dashboardId)
        if (!token) {
            dashboardStatus.text(t('revocationNotSaved'))
            return
        }
        try {
            const password = passwordInput.value().trim()
            await updateExchangeSettings(dashboardId, token, {
                name: nameInput.value().trim() || null,
                live: liveToggle.el.checked,
                // An empty box keeps the password the link has.
                password: password || undefined
            })
            await refreshDashboard()
        } catch (problem) {
            dashboardStatus.text(problem instanceof Error ? problem.message : t('dashboardUnavailable'))
        }
    })

    closeExchange.on('click', async () => {
        const token = getRevocationToken(dashboardId)
        if (!token) return
        if (!window.confirm(t('confirmCloseExchange'))) return
        await revokeShareLink(dashboardId, token)
        dashboardDialog.close()
    })

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
        dashboardDialog,
        // A link that holds several files has no preview page of its own.
        setLink(url: string, previewable: boolean, live = false) {
            link = url
            input.setValue(url)
            show(previewButton, previewable)
            show(manageButton, live)
            const match = /^\/f\/([^/]+)$/.exec(new URL(url).pathname)
            dashboardId = match?.[1] ?? ''
            dashboardIsLive = live
        },
        clear() {
            link = ''
            dashboardId = ''
            input.setValue('')
            qrDialog.close()
            analyticsDialog.close()
            dashboardDialog.close()
            show(manageButton, false)
        }
    })
}
