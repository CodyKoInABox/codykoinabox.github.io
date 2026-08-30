export const projectKinds = [
  "personal",
  "college",
  "professional",
  "other",
] as const

export type ProjectKind = (typeof projectKinds)[number]

export type Localized = {
  readonly en: string
  readonly pt: string
}

export type ProjectSource =
  | {
      readonly type: "github"
      readonly owner: string
      readonly repo: string
      readonly url: string
    }
  | {
      readonly type: "standalone"
    }

export type Project = {
  readonly slug: string
  readonly kind: ProjectKind
  readonly title: Localized
  readonly summary: Localized
  readonly languages: readonly string[]
  readonly source: ProjectSource
  readonly updatedAt: string
  readonly hidden?: boolean
}

export type ProjectOverride = Partial<Omit<Project, "slug">>

export function githubSlug(owner: string, repo: string) {
  return `${owner}-${repo}`.toLowerCase()
}
