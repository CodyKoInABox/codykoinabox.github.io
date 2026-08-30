import { readFile } from "node:fs/promises"
import path from "node:path"

import { detailOverrides } from "@/lib/projects/catalog/manual"
import { linguistColor } from "@/lib/projects/linguist"
import type { LinguistShare, ProjectDetail, ProjectSite } from "@/lib/projects/types"

export function emptyDetail(slug: string): ProjectDetail {
  return {
    slug,
    branch: "main",
    readme: null,
    files: [],
    truncated: false,
    languages: [],
    site: null,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseSite(value: unknown): ProjectSite | null {
  if (!isRecord(value) || typeof value.url !== "string") return null
  const url = value.url.trim()
  if (!url) return null
  return { url }
}

function parseLanguages(value: unknown): readonly LinguistShare[] {
  if (!Array.isArray(value)) return []
  const shares: LinguistShare[] = []
  for (const item of value) {
    if (!isRecord(item)) continue
    if (typeof item.name !== "string") continue
    if (typeof item.bytes !== "number") continue
    if (typeof item.percent !== "number") continue
    shares.push({
      name: item.name,
      bytes: item.bytes,
      percent: item.percent,
      color: typeof item.color === "string" ? item.color : linguistColor(item.name),
    })
  }
  return shares
}

function parseDetail(slug: string, value: unknown): ProjectDetail {
  if (!isRecord(value)) return emptyDetail(slug)

  const files = Array.isArray(value.files)
    ? value.files.filter((item) => typeof item === "string")
    : []

  return {
    slug,
    branch: typeof value.branch === "string" ? value.branch : "main",
    readme: typeof value.readme === "string" ? value.readme : null,
    files,
    truncated: value.truncated === true,
    languages: parseLanguages(value.languages),
    site: parseSite(value.site),
  }
}

export async function getProjectDetail(slug: string): Promise<ProjectDetail> {
  const file = path.join(
    process.cwd(),
    "lib/projects/catalog/details",
    `${slug}.json`
  )

  let base = emptyDetail(slug)
  try {
    const raw = await readFile(file, "utf8")
    base = parseDetail(slug, JSON.parse(raw) as unknown)
  } catch {
    // Details are optional until ingest has run.
  }

  const patch = detailOverrides[slug]
  if (!patch) return base
  return { ...base, ...patch, slug }
}
