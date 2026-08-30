import { isLocale, LOCALE_KEY, type Locale } from "@/lib/i18n/config"

export function detectSystemLocale(): Locale {
  const languages =
    typeof navigator !== "undefined"
      ? navigator.languages?.length
        ? navigator.languages
        : [navigator.language]
      : []

  return languages.some((language) => language.toLowerCase().startsWith("pt"))
    ? "pt"
    : "en"
}

export function persistLocale(locale: Locale) {
  localStorage.setItem(LOCALE_KEY, locale)
}

export const localeRedirectScript = `{
  const stored = localStorage.getItem("${LOCALE_KEY}");
  const languages = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language];
  const system = Array.from(languages).some(function (language) {
    return String(language).toLowerCase().indexOf("pt") === 0;
  }) ? "pt" : "en";
  const locale = stored === "en" || stored === "pt" ? stored : system;
  location.replace("/" + locale + "/");
}`

export function localePath(locale: Locale, rest = "/") {
  const tail = rest.startsWith("/") ? rest : `/${rest}`
  return `/${locale}${tail}`
}

export { isLocale }
