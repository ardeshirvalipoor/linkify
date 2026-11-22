// The switch that lets anyone holding the link add files to it. It starts off,
// because a link normally only sends.

import { Base, Div, Input, Span } from '@codesuma/baseline'
import { t } from '../../lib/i18n'
// The same row as the password switch above it.
import styles from './password-field.module.css'

export const LiveField = () => {
    const base = Div()
    base.addClass(styles.row)

    const toggle = Input('', 'checkbox', { checked: false })
    toggle.addClass(styles.toggle)
    const label = Base('label')
    label.addClass(styles.label)
    label.append(toggle, Span(t('letOthersAdd')))
    base.append(label)

    return Object.assign(base, {
        checked: () => toggle.el.checked,
        reset() {
            toggle.el.checked = false
        }
    })
}
