// A big target that accepts files, either by clicking it or by dropping them on
// it. It emits a `files` event and knows nothing at all about uploading, which is
// why it can be dropped into any page.

import { Base, Div, Input, Span } from '@codesuma/baseline'
import styles from './index.module.css'

export const DropZone = (titleText: string, hintText: string) => {
    // A <label> wrapping a file input is the plain HTML way to make a whole area
    // open the file picker. No click handler needed.
    const base = Base('label')
    base.addClass(styles.zone)

    const input = Input('', 'file')
    input.addClass('hidden')
    input.el.multiple = true

    const icon = Div('+')
    icon.addClass(styles.icon)

    const title = Span(titleText)
    title.addClass(styles.title)

    const hint = Span(hintText)
    hint.addClass(styles.hint)

    // Keep disabled drop zones inert for file picking and drag-and-drop.
    let disabled = false
    const setDisabled = (value: boolean) => {
        disabled = value
        input.el.disabled = value
        base.toggleClass(styles.disabled, value)
        base.el.setAttribute('aria-disabled', String(value))
    }

    input.on('change', () => {
        if (disabled) return
        const files = Array.from(input.el.files ?? [])
        if (!files.length) return

        base.emit('files', files)

        // Without this, picking the same file twice in a row is silent: the
        // browser only fires `change` when the value actually changes.
        input.el.value = ''
    })

    // A drop only works if both dragover and drop cancel the browser's default
    // behaviour, which is to navigate away and open the file.
    base.on('dragover', (event: DragEvent) => {
        event.preventDefault()
        if (disabled) return
        base.addClass(styles.hot)
    })

    base.on('dragleave', () => base.removeClass(styles.hot))

    base.on('drop', (event: DragEvent) => {
        event.preventDefault()
        base.removeClass(styles.hot)
        if (disabled) return

        const files = Array.from(event.dataTransfer?.files ?? [])
        if (files.length) base.emit('files', files)
    })

    base.append(input, icon, title, hint)

    return Object.assign(base, { setDisabled })
}
