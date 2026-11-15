// The grid under the upload card: what Linkify offers, one icon for each point.

import { Base, Div, Span } from '@codesuma/baseline'
import { t } from '../../lib/i18n'
import styles from './benefits.module.css'

// The inside of a 24 by 24 outline icon, one for each benefit.
const ICONS = {
    fast: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    private: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    safe: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    resumable: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    simple: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    reliable: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    size: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>',
    expires: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
    password: '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>'
} as const

type IconName = keyof typeof ICONS

function icon(name: IconName): string {
    return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`
}

export const Benefits = () => {
    const base = Div()
    base.addClass(styles.wrap)

    const title = Base('h2')
    title.addClass(styles.title)
    title.text(t('benefitsTitle'))

    const grid = Div()
    grid.addClass(styles.grid)

    const items: { icon: IconName; title: string; text: string }[] = [
        { icon: 'fast', title: t('fast'), text: t('fastDetail') },
        { icon: 'private', title: t('private'), text: t('privateDetail') },
        { icon: 'safe', title: t('safe'), text: t('safeDetail') },
        { icon: 'resumable', title: t('resumable'), text: t('resumableDetail') },
        { icon: 'simple', title: t('simple'), text: t('simpleDetail') },
        { icon: 'reliable', title: t('reliable'), text: t('reliableDetail') },
        { icon: 'size', title: '1 GB', text: 'Share files up to 1 GB' },
        { icon: 'expires', title: t('expiryLabel'), text: `${t('hour')} · ${t('day')} · ${t('week')}` },
        { icon: 'password', title: t('protect'), text: 'Add an optional access password' }
    ]
    for (const item of items) {
        const block = Div()
        block.addClass(styles.benefit)
        const benefitIcon = Span('')
        benefitIcon.addClass(styles.icon)
        benefitIcon.el.innerHTML = icon(item.icon)
        const heading = Base('strong')
        heading.text(item.title)
        const detail = Span(item.text)
        detail.addClass(styles.detail)
        block.append(benefitIcon, heading, detail)
        grid.append(block)
    }

    base.append(title, grid)
    return base
}
