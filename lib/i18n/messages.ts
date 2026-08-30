import type { Locale } from "@/lib/i18n/config"

export const messages = {
  en: {
    personalPortfolio: "Personal Portfolio",
    contact: "Contact",
    toggleTheme: "Toggle theme",
    toggleLocale: "Switch language",
  },
  pt: {
    personalPortfolio: "Portfólio Pessoal",
    contact: "Contato",
    toggleTheme: "Alternar tema",
    toggleLocale: "Alternar idioma",
  },
} as const

export type Messages = (typeof messages)[Locale]

export function getMessages(locale: Locale): Messages {
  return messages[locale]
}
