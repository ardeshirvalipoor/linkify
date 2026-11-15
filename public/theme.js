// Applies the theme before the first paint, on the app and on the static pages
// alike. A theme the person picked and saved wins. Otherwise the page follows the
// system setting.
let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
try {
    const saved = localStorage.getItem('linkify-theme')
    if (saved === 'dark' || saved === 'light') theme = saved
} catch {
    // Storage can be unavailable. The system setting still applies.
}
document.documentElement.dataset.theme = theme
