// The switch that lets anyone holding the link add files to it. It starts off,
// because a link normally only sends.

import { Base, Div, Input, Span } from '@codesuma/baseline'
import { t } from '../../lib/i18n'
// The same row as the password switch above it.
import styles from './password-field.module.css'

export const LiveField = () => {
    const base = Div()
    base.addClass(styles.row)

    const name = Input('', 'text')
    name.addClass(styles.input)
    name.el.placeholder = t('exchangeNamePlaceholder')
    name.el.setAttribute('aria-label', t('exchangeName'))

    const toggle = Input('', 'checkbox', { checked: false })
    toggle.addClass(styles.toggle)
    const switchTrack = Base('span')
    switchTrack.addClass(styles.switchTrack)
    const switchThumb = Base('span')
    switchThumb.addClass(styles.switchThumb)
    switchTrack.append(toggle, switchThumb)
    const label = Base('label')
    label.addClass(styles.label)
    label.append(switchTrack, Span(t('letOthersAdd')))
    base.append(label, name)

    return Object.assign(base, {
        checked: () => toggle.el.checked,
        reset() {
            toggle.el.checked = false
            name.setValue('')
        }
        ,
        name: () => name.value().trim(),
        setDisabled(disabled: boolean) {
            name.el.disabled = disabled
        }
    })
}
