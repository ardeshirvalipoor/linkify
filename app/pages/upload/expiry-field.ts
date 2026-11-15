// How long the link lasts, counted from when the upload finishes. Only the three
// supported lifetimes are offered, in a native, accessible select.

import { Base, Div, Span } from '@codesuma/baseline'
import type { LinkExpiry } from '../../lib/api'
import { t } from '../../lib/i18n'
import styles from './expiry-field.module.css'

export const ExpiryField = () => {
    const choices: { value: LinkExpiry; label: string }[] = [
        { value: '1h', label: t('hour') },
        { value: '1d', label: t('day') },
        { value: '1w', label: t('week') }
    ]

    const base = Div()
    base.addClass(styles.row)
    const label = Base('label')
    label.addClass(styles.label)
    label.append(Span(t('expiryLabel')))
    const select = Base('select')
    select.addClass(styles.select)
    select.el.setAttribute('aria-label', t('expiryLabel'))
    for (const choice of choices) {
        const option = Base('option')
        option.el.setAttribute('value', choice.value)
        option.el.textContent = choice.label
        select.append(option)
    }
    select.el.value = '1h'
    label.append(select)
    base.append(label)

    const value = () => select.el.value as LinkExpiry

    return Object.assign(base, {
        value,
        // The chosen lifetime in words, such as "1 day".
        label: () => choices.find(choice => choice.value === value())?.label ?? ''
    })
}
