// The static pages do not load the app, so this applies the saved theme before
// the first paint. They are written in English only, so language stays as it is.
let theme = 'light'
try {
    theme = localStorage.getItem('linkify-theme') === 'dark' ? 'dark' : 'light'
} catch {
    theme = 'light'
}
document.documentElement.dataset.theme = theme
