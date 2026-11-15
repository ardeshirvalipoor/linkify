// Revoking the link: a button, then a confirmation in the app's own dialog, and
// only then the request. The dialog comes first so the person can still back out
// before the link stops working for everyone who has it.

import { Button, Div, P } from '@codesuma/baseline'
import * as api from '../../lib/api'
import { t } from '../../lib/i18n'
import { Dialog } from './dialog'
import styles from './revoke-control.module.css'

export const RevokeControl = (onRevoked: () => void, onError: (message: string) => void) => {
    const button = Button(t('revokeLink'))
    button.addClass('button', 'secondary', 'danger')

    const dialog = Dialog(t('confirmRevoke'))
    dialog.title.addClass(styles.title)
    // The warning names the real impact: the link stops for everyone, and this
    // browser cannot undo it.
    const message = P(t('revokeWarning'))
    message.addClass(styles.message)
    const cancel = Button(t('close'))
    cancel.addClass('button', 'secondary')
    const confirm = Button(t('revokeLink'))
    confirm.addClass('button', 'danger')
    const actions = Div()
    actions.addClass(styles.actions)
    actions.append(cancel, confirm)
    dialog.panel.append(message, actions)

    // The link this control can revoke. Null once it is revoked, and when this
    // browser holds no token for it.
    let target: { id: string; token: string } | null = null

    button.on('click', () => {
        if (target) dialog.open()
    })
    cancel.on('click', dialog.close)

    confirm.on('click', async () => {
        dialog.close()
        if (!target) return
        button.el.disabled = true
        try {
            await api.revokeShareLink(target.id, target.token)
            target = null
            onRevoked()
        } catch (problem) {
            onError(problem instanceof Error ? problem.message : t('uploadFailed'))
        } finally {
            button.el.disabled = false
        }
    })

    return Object.assign(button, {
        // The page puts the dialog at its top level, over everything else.
        dialog,
        set(id: string, token: string) {
            target = { id, token }
        },
        clear() {
            target = null
            dialog.close()
        },
        canRevoke: () => target !== null
    })
}
