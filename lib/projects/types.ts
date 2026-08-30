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

export type LinguistShare = {
  readonly name: string
  readonly bytes: number
  readonly percent: number
  readonly color: string
}

export type ProjectSite = {
  readonly url: string
}

export type ProjectDetail = {
  readonly slug: string
  readonly branch: string
  readonly readme: string | null
  readonly files: readonly string[]
  readonly truncated: boolean
  readonly languages: readonly LinguistShare[]
  readonly site: ProjectSite | null
}

export type ProjectDetailOverride = Partial<Omit<ProjectDetail, "slug">>

export function githubSlug(owner: string, repo: string) {
  return `${owner}-${repo}`.toLowerCase()
}
