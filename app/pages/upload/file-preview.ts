// A quick look at the chosen file, made in the browser from the file itself: a
// picture, a video or a PDF. Any other type shows nothing.

import { Base, Div } from '@codesuma/baseline'
import styles from './file-preview.module.css'

export const FilePreview = () => {
    const base = Div()
    base.addClass(styles.wrap)
    const media = Div()
    media.addClass(styles.media)
    base.append(media)

    // Each preview holds the file through an object URL, which is let go here.
    let objectUrl: string | null = null

    function clear() {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl)
            objectUrl = null
        }
        media.el.innerHTML = ''
    }

    function render(file: File) {
        clear()
        const type = file.type || ''

        if (type.startsWith('image/')) {
            const image = Base('img')
            image.el.src = URL.createObjectURL(file)
            image.el.alt = file.name
            media.append(image)
            objectUrl = image.el.src
            return
        }

        if (type.startsWith('video/')) {
            const video = Base('video')
            video.el.src = URL.createObjectURL(file)
            video.el.controls = true
            video.el.muted = true
            media.append(video)
            objectUrl = video.el.src
            return
        }

        if (type === 'application/pdf') {
            const frame = Base('iframe')
            frame.el.src = URL.createObjectURL(file)
            frame.el.title = file.name
            frame.el.setAttribute('sandbox', 'allow-scripts allow-same-origin')
            media.append(frame)
            objectUrl = frame.el.src
        }
    }

    return Object.assign(base, { render, clear })
}
