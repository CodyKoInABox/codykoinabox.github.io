import type { Locale } from "@/lib/i18n/config"
import type { Messages } from "@/lib/i18n/messages"
import type { Project, ProjectDetail } from "@/lib/projects"

export type ModuleSlot = "preview" | "main" | "side"

export type ProjectModuleContext = {
  readonly locale: Locale
  readonly t: Messages
  readonly project: Project
  readonly detail: ProjectDetail
}

export type ProjectModule = {
  readonly id: string
  readonly slot: ModuleSlot
  readonly available: (ctx: ProjectModuleContext) => boolean
  readonly Section: (ctx: ProjectModuleContext) => React.JSX.Element
}
