import { fileTreeModule } from "@/components/project/modules/file-tree"
import { languagesModule } from "@/components/project/modules/languages"
import { readmeModule } from "@/components/project/modules/readme"
import { sitePreviewModule } from "@/components/project/modules/site-preview"
import type { ModuleSlot, ProjectModule } from "@/components/project/modules/types"

export type { ProjectModule, ProjectModuleContext } from "@/components/project/modules/types"

export const projectModules = [
  sitePreviewModule,
  fileTreeModule,
  languagesModule,
  readmeModule,
] as const satisfies readonly ProjectModule[]

export function modulesInSlot(slot: ModuleSlot) {
  return projectModules.filter((mod) => mod.slot === slot)
}
