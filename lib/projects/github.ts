import type { Project } from "@/lib/projects/types"

export type GithubRepoRef = {
  readonly owner: string
  readonly repo: string
  readonly branch: string
}

export type GithubEntry =
  | { readonly kind: "dir"; readonly name: string; readonly path: string }
  | {
      readonly kind: "file"
      readonly name: string
      readonly path: string
      readonly size: number
    }

export type GithubFileView =
  | { readonly kind: "text"; readonly path: string; readonly text: string }
  | { readonly kind: "image"; readonly path: string; readonly url: string }
  | { readonly kind: "binary"; readonly path: string; readonly url: string }

const IMAGE_EXT = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
  "ico",
  "bmp",
  "avif",
])

const MARKDOWN_EXT = new Set(["md", "markdown", "mdx"])
const TEXT_MAX = 512_000
const BLOB_RE =
  /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:blob|raw)\/([^/]+)\/(.+)$/i

export function githubRef(
  project: Project,
  branch: string
): GithubRepoRef | null {
  if (project.source.type !== "github") return null
  return { owner: project.source.owner, repo: project.source.repo, branch }
}

export function encodePath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/")
}

export function rawFileUrl(ref: GithubRepoRef, path: string) {
  const suffix = encodePath(path)
  return `https://raw.githubusercontent.com/${ref.owner}/${ref.repo}/${ref.branch}${suffix ? `/${suffix}` : ""}`
}

export function rawDirBase(ref: GithubRepoRef, dir: string) {
  const suffix = encodePath(dir)
  return `https://raw.githubusercontent.com/${ref.owner}/${ref.repo}/${ref.branch}/${suffix ? `${suffix}/` : ""}`
}

export function blobFileUrl(ref: GithubRepoRef, path: string) {
  const suffix = encodePath(path)
  return `https://github.com/${ref.owner}/${ref.repo}/blob/${ref.branch}${suffix ? `/${suffix}` : ""}`
}

export function githubContentsUrl(ref: GithubRepoRef, path: string) {
  const suffix = encodePath(path)
  const base = `https://api.github.com/repos/${ref.owner}/${ref.repo}/contents`
  return `${base}${suffix ? `/${suffix}` : ""}?ref=${encodeURIComponent(ref.branch)}`
}

export function githubLanguagesUrl(ref: GithubRepoRef) {
  return `https://api.github.com/repos/${ref.owner}/${ref.repo}/languages`
}

export function extensionOf(path: string) {
  const name = path.split("/").at(-1) ?? path
  const dot = name.lastIndexOf(".")
  if (dot <= 0) return ""
  return name.slice(dot + 1).toLowerCase()
}

export function isImagePath(path: string) {
  return IMAGE_EXT.has(extensionOf(path))
}

export function isMarkdownPath(path: string) {
  return MARKDOWN_EXT.has(extensionOf(path))
}

export function parentDir(path: string) {
  const parts = path.split("/").filter(Boolean)
  parts.pop()
  return parts.join("/")
}

export function rewriteMediaUrl(
  src: string,
  ref: GithubRepoRef,
  dir: string
) {
  const trimmed = src.trim()
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("data:")) {
    return trimmed
  }
  if (trimmed.startsWith("mailto:") || trimmed.startsWith("javascript:")) {
    return trimmed
  }

  const withoutHash = trimmed.split("#")[0] ?? trimmed
  const blob = withoutHash.match(BLOB_RE)
  if (blob) {
    const owner = blob[1]
    const repo = blob[2]
    const branch = blob[3]
    const filePath = blob[4]
    if (owner && repo && branch && filePath) {
      return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
    }
  }

  if (/^https?:\/\//i.test(withoutHash)) return withoutHash

  const root = rawDirBase(ref, "")
  try {
    const resolved = new URL(withoutHash, rawDirBase(ref, dir)).href
    if (resolved.startsWith(root)) return resolved
  } catch {
    // fall through
  }
  return `${root}${withoutHash.replace(/^\.\//, "")}`
}

export function htmlImagesToMarkdown(
  markdown: string,
  ref: GithubRepoRef,
  dir: string
) {
  return markdown.replace(/<img\b([^>]*?)\/?>/gi, (full, attrs: string) => {
    const src = attrs.match(/\bsrc=["']([^"']+)["']/i)?.[1]
    if (!src) return full
    const alt = attrs.match(/\balt=["']([^"']*)["']/i)?.[1] ?? ""
    return `![${alt}](${rewriteMediaUrl(src, ref, dir)})`
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseEntry(value: unknown): GithubEntry | null {
  if (!isRecord(value)) return null
  if (typeof value.name !== "string" || typeof value.path !== "string") {
    return null
  }
  if (value.type === "dir") {
    return { kind: "dir", name: value.name, path: value.path }
  }
  if (value.type === "file") {
    return {
      kind: "file",
      name: value.name,
      path: value.path,
      size: typeof value.size === "number" ? value.size : 0,
    }
  }
  return null
}

export function parseContents(value: unknown): GithubEntry[] | null {
  const rows = Array.isArray(value) ? value : [value]
  const entries: GithubEntry[] = []
  for (const row of rows) {
    const entry = parseEntry(row)
    if (entry) entries.push(entry)
  }
  if (entries.length === 0) return null
  return sortEntries(entries)
}

export function sortEntries(entries: readonly GithubEntry[]) {
  return [...entries].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

export function entriesInDir(files: readonly string[], dir: string) {
  const prefix = dir ? `${dir}/` : ""
  const dirs = new Set<string>()
  const entries: GithubEntry[] = []

  for (const file of files) {
    if (prefix && !file.startsWith(prefix)) continue
    const rest = prefix ? file.slice(prefix.length) : file
    if (!rest) continue
    const slash = rest.indexOf("/")
    if (slash === -1) {
      entries.push({ kind: "file", name: rest, path: file, size: 0 })
      continue
    }
    const name = rest.slice(0, slash)
    if (dirs.has(name)) continue
    dirs.add(name)
    entries.push({ kind: "dir", name, path: `${prefix}${name}` })
  }

  return sortEntries(entries)
}

export function parseLanguageBytes(value: unknown) {
  if (!isRecord(value)) return null
  const bytes: Record<string, number> = {}
  for (const [name, count] of Object.entries(value)) {
    if (typeof count === "number" && bytes[name] === undefined && count > 0) {
      bytes[name] = count
    }
  }
  return Object.keys(bytes).length > 0 ? bytes : null
}

export async function fetchGithubListing(ref: GithubRepoRef, path: string) {
  try {
    const response = await fetch(githubContentsUrl(ref, path), {
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!response.ok) return null
    const json: unknown = await response.json()
    return parseContents(json)
  } catch {
    return null
  }
}

export async function fetchGithubFile(
  ref: GithubRepoRef,
  path: string
): Promise<GithubFileView | null> {
  const url = rawFileUrl(ref, path)
  if (isImagePath(path)) {
    return { kind: "image", path, url }
  }

  try {
    const response = await fetch(url)
    if (!response.ok) return null

    const buffer = await response.arrayBuffer()
    if (buffer.byteLength > TEXT_MAX) {
      return { kind: "binary", path, url }
    }

    const bytes = new Uint8Array(buffer)
    if (bytes.includes(0)) {
      return { kind: "binary", path, url }
    }

    const text = new TextDecoder("utf-8").decode(bytes)
    return { kind: "text", path, text }
  } catch {
    return null
  }
}

export async function fetchGithubReadme(ref: GithubRepoRef) {
  const names = ["README.md", "readme.md", "README.MD", "README"]
  for (const name of names) {
    try {
      const response = await fetch(rawFileUrl(ref, name))
      if (!response.ok) continue
      const text = await response.text()
      if (!text || text.startsWith("404:")) continue
      return { path: name, text }
    } catch {
      continue
    }
  }
  return null
}

export async function fetchGithubLanguages(ref: GithubRepoRef) {
  try {
    const response = await fetch(githubLanguagesUrl(ref), {
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!response.ok) return null
    const json: unknown = await response.json()
    return parseLanguageBytes(json)
  } catch {
    return null
  }
}
