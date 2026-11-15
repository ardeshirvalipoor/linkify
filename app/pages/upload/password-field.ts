// An optional password, chosen before the link is made. The box opens only once
// the person ticks the toggle, and any problem shows directly under it.

import { Base, Div, Input, P, Span } from '@codesuma/baseline'
import { t } from '../../lib/i18n'
import { show } from '../../lib/show'
import styles from './password-field.module.css'

export const PasswordField = () => {
    const base = Div()
    base.addClass(styles.row)

    const toggle = Input('', 'checkbox', { checked: false })
    toggle.addClass(styles.toggle)
    const label = Base('label')
    label.addClass(styles.label)
    label.append(toggle, Span(t('protect')))

    const input = Input('', 'password')
    input.addClass(styles.input)
    input.el.setAttribute('placeholder', t('passwordPlaceholder'))
    input.el.setAttribute('aria-label', t('enterPassword'))

    const error = P('')
    error.addClass('error', styles.error)

    base.append(label, input, error)

    toggle.el.addEventListener('change', () => {
        show(input, toggle.el.checked)
        show(error, false)
        if (!toggle.el.checked) input.setValue('')
    })
    // Clear the required-password message as soon as a value is entered.
    input.el.addEventListener('input', () => {
        if (input.value().trim()) show(error, false)
    })

    function reset() {
        toggle.el.checked = false
        input.setValue('')
        show(input, false)
        show(error, false)
    }
    reset()

    return Object.assign(base, {
        // The password to use: undefined when there is none, and null when what
        // was typed is not allowed. The reason is then already on screen.
        read(): string | undefined | null {
            if (!toggle.el.checked) return undefined
            const password = input.value().trim()
            const problem = !password ? 'passwordRequired'
                : password.length < 6 ? 'passwordTooShort'
                    : password.length > 128 ? 'passwordTooLong'
                        : null
            show(error, Boolean(problem))
            if (!problem) return password
            error.text(t(problem))
            return null
        },
        reset
    })
}
