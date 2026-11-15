import { Base } from '@codesuma/baseline'

const links = [
    { href: '/how-it-works.html', label: 'How it works' },
    { href: '/about.html', label: 'About' },
    { href: '/terms.html', label: 'Terms' },
    { href: '/privacy.html', label: 'Privacy' }
]

// Every link opens a new tab, because this header stays on screen during an
// upload. Leaving the page would stop the upload or lose the share link.
export function createSiteNavigation() {
    const header = Base('header')
    header.addClass('site-header')

    // The logo is the link's background, chosen by CSS for the theme and the
    // screen width, so the label is what a screen reader says.
    const brand = Base('a')
    brand.addClass('site-brand')
    brand.el.href = '/'
    brand.el.target = '_blank'
    brand.el.rel = 'noopener noreferrer'
    brand.el.setAttribute('aria-label', 'Linkify home')

    const nav = Base('nav')
    nav.addClass('site-nav')
    nav.el.setAttribute('aria-label', 'Main navigation')

    for (const item of links) {
        const link = Base('a')
        link.el.href = item.href
        link.el.target = '_blank'
        link.el.rel = 'noopener noreferrer'
        link.el.textContent = item.label
        nav.append(link)
    }

    header.append(brand, nav)
    return header
}
