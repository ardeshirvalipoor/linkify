// "About Linkify", under the benefits: what the service is, and where to read more.

import { Base, Div, P } from '@codesuma/baseline'
import { t } from '../../lib/i18n'
import styles from './about.module.css'

export const About = () => {
    const base = Div()
    base.addClass(styles.wrap)

    const title = Base('h2')
    title.addClass(styles.title)
    title.text(t('aboutTitle'))

    const description = P(t('aboutDescription'))
    description.addClass(styles.description)

    const links = Div()
    links.addClass(styles.links)
    for (const item of [
        { href: '/about.html', label: 'Meet Linkify' },
        { href: '/how-it-works.html', label: 'See how it works' }
    ]) {
        const link = Base('a')
        link.el.href = item.href
        // A new tab, so reading more never stops an upload or loses a share link.
        link.el.target = '_blank'
        link.el.rel = 'noopener noreferrer'
        link.el.textContent = item.label
        links.append(link)
    }

    base.append(title, description, links)
    return base
}
