import { Base } from '@codesuma/baseline'

const links = [
    { href: '/how-it-works.html', label: 'How it works' },
    { href: '/about.html', label: 'About' },
    { href: '/terms.html', label: 'Terms' },
    { href: '/privacy.html', label: 'Privacy' }
]

// Header links stay in the current tab so every page has a direct route home.
export function createSiteNavigation() {
    const header = Base('header')
    header.addClass('site-header')

    const brand = Base('a')
    brand.addClass('site-brand')
    brand.el.href = '/'
    brand.el.setAttribute('aria-label', 'Linkify home')

    const logo = Base('img')
    logo.el.alt = 'Linkify'
    logo.el.height = 36
    logo.el.src = logoSource()
    brand.append(logo)

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

export function updateSiteLogos(): void {
    document.querySelectorAll<HTMLImageElement>('.site-brand img').forEach(logo => {
        logo.src = logoSource()
    })
}

function logoSource(): string {
    if (window.matchMedia('(max-width: 560px)').matches) return '/linkify-icon.svg'
    return document.documentElement.dataset.theme === 'dark'
        ? '/linkify-logo-for-dark-bg.svg'
        : '/linkify-logo-for-light-bg.svg'
}

    window.addEventListener('resize', updateSiteLogos)
