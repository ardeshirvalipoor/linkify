// The static pages do not load the app, so this applies the saved theme before
// the first paint. They are written in English only, so language stays as it is.
let theme = 'dark'
try {
    theme = localStorage.getItem('linkify-theme') === 'light' ? 'light' : 'dark'
} catch {
    theme = 'dark'
}
document.documentElement.dataset.theme = theme
