import { extras, overrides } from "@/lib/projects/catalog/manual"
import { githubProjects } from "@/lib/projects/catalog/github"
import type { Locale } from "@/lib/i18n/config"
import {
  projectKinds,
  type Localized,
  type Project,
  type ProjectKind,
} from "@/lib/projects/types"

export {
  githubSlug,
  projectKinds,
  type Localized,
  type Project,
  type ProjectKind,
  type ProjectOverride,
  type ProjectSource,
} from "@/lib/projects/types"

export function localized(value: Localized, locale: Locale) {
  return value[locale]
}

export function projectPath(locale: Locale, slug: string) {
  return `/${locale}/projects/${slug}/`
}

function mergeCatalog() {
  const bySlug = new Map<string, Project>()

  for (const project of githubProjects) {
    bySlug.set(project.slug, project)
  }

  for (const [slug, patch] of Object.entries(overrides)) {
    const existing = bySlug.get(slug)
    if (!existing) continue
    bySlug.set(slug, { ...existing, ...patch, slug })
  }

  for (const extra of extras) {
    bySlug.set(extra.slug, extra)
  }

  return [...bySlug.values()]
    .filter((project) => !project.hidden)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

const catalog = mergeCatalog()

export function getProjects() {
  return catalog
}

export function filterProjects({
  projects,
  kind,
  language,
}: {
  readonly projects: readonly Project[]
  readonly kind?: ProjectKind
  readonly language?: string
}) {
  return projects.filter((project) => {
    if (kind && project.kind !== kind) return false
    if (language && !project.languages.includes(language)) return false
    return true
  })
}

export function presentKinds(projects: readonly Project[]) {
  const seen = new Set<ProjectKind>()
  for (const project of projects) seen.add(project.kind)
  return projectKinds.filter((kind) => seen.has(kind))
}

export function presentLanguages(projects: readonly Project[]) {
  const seen = new Set<string>()
  for (const project of projects) {
    for (const language of project.languages) seen.add(language)
  }
  return [...seen].sort((a, b) => a.localeCompare(b))
}
