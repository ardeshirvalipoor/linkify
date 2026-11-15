// The files behind a link that holds several, each with its own download button.

import { Base, Button, Div, P } from '@codesuma/baseline'
import { collectionFileDownloadUrl, FileInfo } from '../../lib/api'
import { fileSize } from '../../lib/format'
import { t } from '../../lib/i18n'
import styles from './collection-list.module.css'

export const CollectionList = () => {
    const base = Div()
    base.addClass(styles.list)

    return Object.assign(base, {
        render(collectionId: string, files: FileInfo[], password?: string) {
            base.el.replaceChildren()
            const shareUrl = new URL(window.location.href)
            for (const file of files) {
                const row = Div()
                row.addClass(styles.file)
                const details = Div()
                details.addClass(styles.details)
                const name = Base('strong')
                name.text(file.fileName)
                const size = P(fileSize(file.size))
                size.addClass(styles.size)
                details.append(name, size)

                // A normal navigation, like the single-file download. The server
                // answers with a redirect to the storage.
                const download = Button(t('download'))
                download.addClass('button', 'primary')
                download.on('click', () => {
                    window.location.href = collectionFileDownloadUrl(collectionId, file.id, shareUrl, password)
                })

                row.append(details, download)
                base.append(row)
            }
        },
        clear() {
            base.el.replaceChildren()
        }
    })
}
