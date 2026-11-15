// A short message in the corner of the screen that goes away on its own, for
// news about one file while the rest of the queue carries on.
//
// It lives on the document's body, not in the page. The page has a transform and
// scrolls, so a fixed box inside it would scroll away with the content.

import { Div } from '@codesuma/baseline'
import { show } from '../../lib/show'
import styles from './toast.module.css'

export const Toast = () => {
    const base = Div('')
    base.addClass(styles.toast)
    base.el.setAttribute('role', 'status')
    base.el.setAttribute('aria-live', 'polite')
    show(base, false)
    document.body.append(base.el)

    let timer = 0

    function dismiss() {
        window.clearTimeout(timer)
        show(base, false)
    }

    return Object.assign(base, {
        notify(message: string, kind: 'success' | 'error') {
            window.clearTimeout(timer)
            base.text(message)
            base.toggleClass(styles.success, kind === 'success')
            base.toggleClass(styles.error, kind === 'error')
            show(base, true)
            timer = window.setTimeout(dismiss, 4500)
        },
        dismiss
    })
}
