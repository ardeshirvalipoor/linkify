// The files in the upload queue, each with how far it has got.

import { Base, Div, Span } from '@codesuma/baseline'
import { fileSize } from '../../lib/format'
import { t } from '../../lib/i18n'
import type { QueueItem } from '../../lib/upload-queue'
import styles from './queue-list.module.css'

export const QueueList = () => {
    const base = Div()
    base.addClass(styles.panel)

    const title = Base('h2')
    title.addClass(styles.title)
    title.text(t('uploadQueue'))

    const list = Base('ol')
    list.addClass(styles.list)

    base.append(title, list)

    return Object.assign(base, {
        render(items: readonly QueueItem[]) {
            list.el.replaceChildren()
            for (const item of items) {
                const row = Base('li')
                row.addClass(styles.item)
                const details = Div()
                details.addClass(styles.file)
                const name = Span(item.file.name)
                name.addClass(styles.name)
                const size = Span(fileSize(item.file.size))
                size.addClass(styles.size)
                details.append(name, size)
                const state = Span(t(item.status))
                state.addClass(styles.state, styles[item.status])
                row.append(details, state)
                list.append(row)
            }
        }
    })
}
