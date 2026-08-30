import { ReadmeLive } from "@/components/project/readme-live"
import type { ProjectModule, ProjectModuleContext } from "@/components/project/modules/types"

function ReadmeSection(ctx: ProjectModuleContext) {
  return <ReadmeLive {...ctx} />
}

export const readmeModule: ProjectModule = {
  id: "readme",
  slot: "main",
  available: (ctx) =>
    ctx.project.source.type === "github" || Boolean(ctx.detail.readme),
  Section: ReadmeSection,
}
