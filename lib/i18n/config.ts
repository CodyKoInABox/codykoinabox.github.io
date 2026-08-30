export const locales = ["en", "pt"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  pt: "pt-BR",
}

export const LOCALE_KEY = "locale"

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "pt"
}
