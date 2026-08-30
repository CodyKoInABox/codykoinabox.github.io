import type { Project, ProjectOverride } from "@/lib/projects/types"

/** Patch a GitHub-seeded project by slug. */
export const overrides: Record<string, ProjectOverride> = {}

/** Standalone / professional / anything without a list membership. */
export const extras: readonly Project[] = []
