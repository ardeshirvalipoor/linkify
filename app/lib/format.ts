// Turning numbers into words a person can read.

const UNITS = ['B', 'KB', 'MB', 'GB']

export function fileSize(bytes: number): string {
    let size = bytes
    let unit = 0

    while (size >= 1024 && unit < UNITS.length - 1) {
        size = size / 1024
        unit++
    }

    // Bytes and kilobytes never need a decimal; megabytes and up read better
    // with one.
    return `${size.toFixed(unit < 2 ? 0 : 1)} ${UNITS[unit]}`
}

export function percentage(done: number, total: number): number {
    if (total <= 0) return 0
    return Math.min(100, Math.round((done / total) * 100))
}

// "3 MB/s", based on how much has moved since the upload started. An average
// over the whole upload is steadier to read than a live speed, which jumps
// around too much to be useful.
export function transferRate(bytes: number, milliseconds: number): string {
    if (milliseconds < 1000) return ''
    return `${fileSize(bytes / (milliseconds / 1000))}/s`
}

// "5 min" or "1 hr 5 min", rounded up, with the units in the reader's language.
export function duration(seconds: number, locale: string): string {
    const unit = (value: number, name: 'second' | 'minute' | 'hour') =>
        new Intl.NumberFormat(locale, { style: 'unit', unit: name, unitDisplay: 'short' }).format(value)

    if (seconds < 60) return unit(Math.ceil(seconds), 'second')
    const minutes = Math.ceil(seconds / 60)
    if (minutes < 60) return unit(minutes, 'minute')
    const hours = Math.floor(minutes / 60)
    return minutes % 60 ? `${unit(hours, 'hour')} ${unit(minutes % 60, 'minute')}` : unit(hours, 'hour')
}
