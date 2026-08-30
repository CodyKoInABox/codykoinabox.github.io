import { FileBrowser } from "@/components/project/file-browser"
import type { ProjectModule, ProjectModuleContext } from "@/components/project/modules/types"

function FileTreeSection(ctx: ProjectModuleContext) {
  return <FileBrowser {...ctx} />
}

export const fileTreeModule: ProjectModule = {
  id: "files",
  slot: "main",
  available: (ctx) =>
    ctx.project.source.type === "github" || ctx.detail.files.length > 0,
  Section: FileTreeSection,
}
