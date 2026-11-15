// A box over the page, kept inside the app rather than a browser prompt.
//
// It is a native <dialog> opened with showModal(), which puts it in the browser's
// top layer: above everything, and fixed to the window. An ordinary fixed box
// would not do, because the page has a transform and scrolls, and a fixed box
// inside it scrolls away with the content. Escape closes it, and so does a click
// on the dim backdrop around it.

import { Base, Div } from '@codesuma/baseline'
import styles from './dialog.module.css'

export const Dialog = (titleText: string) => {
    const base = Base('dialog')
    base.addClass(styles.dialog)

    const panel = Div()
    panel.addClass(styles.panel)

    const title = Base('h3')
    title.addClass(styles.title)
    title.text(titleText)

    panel.append(title)
    base.append(panel)

    const close = () => base.el.close()
    // A click on the backdrop lands on the <dialog> itself, outside the panel.
    base.el.addEventListener('click', event => {
        if (event.target === base.el) close()
    })

    return Object.assign(base, {
        panel,
        title,
        open: () => {
            if (!base.el.open) base.el.showModal()
        },
        close
    })
}
