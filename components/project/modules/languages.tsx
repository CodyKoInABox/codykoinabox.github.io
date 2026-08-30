import { LanguagesLive } from "@/components/project/languages-live"
import type { ProjectModule, ProjectModuleContext } from "@/components/project/modules/types"

function LanguagesSection(ctx: ProjectModuleContext) {
  return <LanguagesLive {...ctx} />
}

export const languagesModule: ProjectModule = {
  id: "languages",
  slot: "side",
  available: (ctx) =>
    ctx.project.source.type === "github" ||
    ctx.detail.languages.length > 0 ||
    ctx.project.languages.length > 0,
  Section: LanguagesSection,
}
