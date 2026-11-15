// The theme and language controls at the top of every routed screen.

import { Button, Div, Base, Span } from '@codesuma/baseline'
import { currentLanguage, languages, t } from './i18n'

// public/theme.js has already set the theme before the first paint. This sets
// the language and the text direction before routing creates the page.
export function initializePreferences(): void {
    const language = currentLanguage()
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
}

// Provide persistent theme and language controls shared by each routed screen.
export function createPreferencesBar() {
    const bar = Div()
    bar.addClass('preferences-bar')

    const themeButton = Button('')
    themeButton.addClass('theme-toggle')
    const updateThemeButton = () => {
        const dark = document.documentElement.dataset.theme === 'dark'
        const label = t(dark ? 'switchLight' : 'switchDark')
        themeButton.text(dark ? '☀' : '☾')
        themeButton.el.title = label
        themeButton.el.setAttribute('aria-label', label)
        themeButton.el.setAttribute('aria-pressed', String(dark))
    }
    updateThemeButton()
    themeButton.on('click', () => {
        const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
        document.documentElement.dataset.theme = theme
        try {
            localStorage.setItem('linkify-theme', theme)
        } catch {
            // Keep the current page usable when browser storage is unavailable.
        }
        updateThemeButton()
    })

    const languageLabel = Base('label')
    languageLabel.addClass('language-control')
    const globe = Span('')
    globe.addClass('globe-icon')
    globe.el.setAttribute('aria-hidden', 'true')
    const select = Base('select')
    select.addClass('language-select')
    select.el.setAttribute('aria-label', t('language'))
    select.el.title = t('language')
    for (const language of languages) {
        const option = Base('option')
        option.el.value = language.code
        option.el.textContent = language.name
        option.el.selected = language.code === currentLanguage()
        select.append(option)
    }
    select.on('change', () => {
        try {
            localStorage.setItem('linkify-language', select.el.value)
        } catch {
            // Reload with the current browser's default when storage is unavailable.
        }
        window.location.reload()
    })
    languageLabel.append(globe, select)
    bar.append(themeButton, languageLabel)
    return bar
}
