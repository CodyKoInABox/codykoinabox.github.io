import type {
  Project,
  ProjectDetailOverride,
  ProjectOverride,
} from "@/lib/projects/types"

/** Patch a GitHub-seeded project by slug. */
export const overrides: Record<string, ProjectOverride> = {}

/** Patch ingested README / tree / linguist / site by slug. */
export const detailOverrides: Record<string, ProjectDetailOverride> = {}

/** Standalone / professional / anything without a list membership. */
export const extras: readonly Project[] = []
