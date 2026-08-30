import type { Locale } from "@/lib/i18n/config"

export const messages = {
  en: {
    personalPortfolio: "Personal Portfolio",
    contact: "Contact",
    toggleTheme: "Toggle theme",
    toggleLocale: "Switch language",
    projects: "Projects",
    filterAll: "All",
    filterLanguage: "Language",
    kindPersonal: "Personal",
    kindCollege: "College",
    kindProfessional: "Professional",
    kindOther: "Other",
    projectsEmpty: "No projects match.",
    openOnGitHub: "Open on GitHub",
    viewProject: "View project",
  },
  pt: {
    personalPortfolio: "Portfólio Pessoal",
    contact: "Contato",
    toggleTheme: "Alternar tema",
    toggleLocale: "Alternar idioma",
    projects: "Projetos",
    filterAll: "Todos",
    filterLanguage: "Linguagem",
    kindPersonal: "Pessoal",
    kindCollege: "Faculdade",
    kindProfessional: "Profissional",
    kindOther: "Outros",
    projectsEmpty: "Nenhum projeto corresponde.",
    openOnGitHub: "Abrir no GitHub",
    viewProject: "Ver projeto",
  },
} as const

export type Messages = (typeof messages)[Locale]

export function getMessages(locale: Locale): Messages {
  return messages[locale]
}
