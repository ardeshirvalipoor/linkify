// Every word the app shows, in twelve languages, and the function that picks the
// right one. English defines the keys in en.ts. Each other file is typed as a full
// Dictionary, so a key missing from any language stops the type check.

import { ar } from './ar'
import { de } from './de'
import { en, type TranslationKey } from './en'
import { es } from './es'
import { fr } from './fr'
import { hi } from './hi'
import { ja } from './ja'
import { ko } from './ko'
import { pt } from './pt'
import { ru } from './ru'
import { tr } from './tr'
import { zh } from './zh'

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ar' | 'hi' | 'zh' | 'tr' | 'ja' | 'ru' | 'pt' | 'ko'

// Keep the language options ordered by common use, with each native language name shown in its own script.
export const languages: { code: Language; name: string; locale: string }[] = [
    { code: 'en', name: 'English', locale: 'en' },
    { code: 'es', name: 'Español', locale: 'es' },
    { code: 'fr', name: 'Français', locale: 'fr' },
    { code: 'de', name: 'Deutsch', locale: 'de' },
    { code: 'ar', name: 'العربية', locale: 'ar' },
    { code: 'hi', name: 'हिन्दी', locale: 'hi' },
    { code: 'zh', name: '简体中文', locale: 'zh-CN' },
    { code: 'tr', name: 'Türkçe', locale: 'tr' },
    { code: 'ja', name: '日本語', locale: 'ja' },
    { code: 'ru', name: 'Русский', locale: 'ru' },
    { code: 'pt', name: 'Português', locale: 'pt' },
    { code: 'ko', name: '한국어', locale: 'ko' }
]

const dictionaries: Record<Language, Record<TranslationKey, string>> = { en, es, fr, de, ar, hi, zh, tr, ja, ru, pt, ko }

// Read the saved language safely and fall back to English for unsupported values.
export function currentLanguage(): Language {
    try {
        const saved = localStorage.getItem('linkify-language')
        return languages.some(language => language.code === saved) ? saved as Language : 'en'
    } catch {
        return 'en'
    }
}

// Return translated UI copy, replacing named values in dynamic status strings.
export function t(key: TranslationKey, values: Record<string, string | number> = {}): string {
    let text = dictionaries[currentLanguage()][key]
    for (const [name, value] of Object.entries(values)) text = text.replace(`{${name}}`, String(value))
    return text
}

export function languageLocale(): string {
    return languages.find(language => language.code === currentLanguage())?.locale ?? 'en'
}

// Translate the stable status messages emitted by the resumable upload helper.
export function translateUploadStatus(message: string): string {
    if (message === 'Preparing the upload') return t('preparingUpload')
    if (message === 'Putting the parts together') return t('assemblingParts')
    const sending = /^Sending (\d+) of (\d+) parts$/.exec(message)
    if (sending) return t('sendingParts', { missing: sending[1], total: sending[2] })
    const continuing = /^Continuing an earlier upload, (\d+) of (\d+) parts already sent$/.exec(message)
    if (continuing) return t('continuingUpload', { sent: continuing[1], total: continuing[2] })
    return message
}
