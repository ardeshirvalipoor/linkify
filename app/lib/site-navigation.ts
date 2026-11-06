import { Base } from '@codesuma/baseline'

const links = [
    { href: '/how-it-works.html', label: 'How it works' },
    { href: '/about.html', label: 'About' },
    { href: '/terms.html', label: 'Terms' },
    { href: '/privacy.html', label: 'Privacy' }
]

export function createSiteNavigation() {
    const header = Base('header')
    header.addClass('site-header')

    const brand = Base('a')
    brand.addClass('site-brand')
    brand.el.href = '/'
    brand.el.textContent = 'Linkify'
    brand.el.setAttribute('aria-label', 'Linkify home')

    const nav = Base('nav')
    nav.addClass('site-nav')
    nav.el.setAttribute('aria-label', 'Main navigation')

    for (const item of links) {
        const link = Base('a')
        link.el.href = item.href
        link.el.textContent = item.label
        nav.append(link)
    }

    header.append(brand, nav)
    return header
}
