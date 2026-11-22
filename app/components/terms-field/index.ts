// The consent checkbox. It sits directly under the upload field, and nothing can
// be chosen or sent until it is ticked. The share page uses it too, before
// someone adds files to a link.

import { Base, Div, Input, P, Span } from '@codesuma/baseline'
import { t } from '../../lib/i18n'
import { show } from '../../lib/show'
import styles from './index.module.css'

export const TermsField = (onChange: (accepted: boolean) => void) => {
    const base = Div()
    base.addClass(styles.row)

    const checkbox = Input('', 'checkbox', { checked: false })
    checkbox.addClass(styles.checkbox)
    const label = Base('label')
    label.addClass(styles.label)
    label.append(checkbox, Span(`${t('agree')} `), link('/terms.html', t('terms')), Span(` ${t('and')} `), link('/privacy.html', t('privacy')))

    // Explain that consent is required. The note goes once the box is ticked.
    const hint = P(t('acceptBeforeUse'))
    hint.addClass('note')

    base.append(label, hint)

    checkbox.el.addEventListener('change', () => {
        show(hint, !checkbox.el.checked)
        onChange(checkbox.el.checked)
    })

    return Object.assign(base, {
        accepted: () => checkbox.el.checked,
        reset() {
            checkbox.el.checked = false
            show(hint, true)
        }
    })
}

function link(href: string, label: string) {
    const anchor = Base('a')
    anchor.el.href = href
    // A new tab, so reading the terms never loses the files already chosen.
    anchor.el.target = '_blank'
    anchor.el.rel = 'noopener noreferrer'
    anchor.el.textContent = label
    return anchor
}
