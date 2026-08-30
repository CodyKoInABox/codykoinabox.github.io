"use client"

import { useEffect, useState } from "react"
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
} from "lucide-react"

import { GithubMarkdown } from "@/components/project/github-markdown"
import type { ProjectModuleContext } from "@/components/project/modules/types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  blobFileUrl,
  entriesInDir,
  fetchGithubFile,
  fetchGithubListing,
  githubRef,
  isMarkdownPath,
  parentDir,
  type GithubEntry,
  type GithubFileView,
} from "@/lib/projects/github"

type BrowserView =
  | { readonly kind: "dir"; readonly path: string }
  | { readonly kind: "file"; readonly path: string }

function crumbs(path: string) {
  const parts = path.split("/").filter(Boolean)
  const items: { label: string; path: string }[] = [{ label: "/", path: "" }]
  let acc = ""
  for (const part of parts) {
    acc = acc ? `${acc}/${part}` : part
    items.push({ label: part, path: acc })
  }
  return items
}

function FileRows({
  entries,
  onOpen,
}: {
  readonly entries: readonly GithubEntry[]
  readonly onOpen: (entry: GithubEntry) => void
}) {
  return (
    <ul className="flex flex-col">
      {entries.map((entry) => (
        <li key={`${entry.kind}-${entry.path}`}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => onOpen(entry)}
          >
            {entry.kind === "dir" ? (
              <FolderIcon data-icon="inline-start" />
            ) : (
              <FileIcon data-icon="inline-start" />
            )}
            <span className="truncate">{entry.name}</span>
          </Button>
        </li>
      ))}
    </ul>
  )
}

function FileBody({
  github,
  view,
}: {
  readonly github: NonNullable<ReturnType<typeof githubRef>>
  readonly view: GithubFileView
}) {
  if (view.kind === "image") {
    return (
      <img
        src={view.url}
        alt=""
        className="max-h-[32rem] max-w-full object-contain"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    )
  }

  if (view.kind === "binary") {
    return (
      <a
        href={view.url}
        target="_blank"
        rel="noreferrer"
        className="text-sm underline underline-offset-4"
      >
        {view.path}
      </a>
    )
  }

  if (isMarkdownPath(view.path)) {
    return (
      <GithubMarkdown
        markdown={view.text}
        github={github}
        dir={parentDir(view.path)}
      />
    )
  }

  return (
    <pre className="overflow-auto p-4 text-xs leading-relaxed">
      <code>{view.text}</code>
    </pre>
  )
}

export function FileBrowser({ project, detail, t }: ProjectModuleContext) {
  const github = githubRef(project, detail.branch)
  const ingested = detail.files
  const [view, setView] = useState<BrowserView>({ kind: "dir", path: "" })
  const [entries, setEntries] = useState<GithubEntry[] | null>(
    ingested.length > 0 ? entriesInDir(ingested, "") : null
  )
  const [file, setFile] = useState<GithubFileView | null>(null)
  const [pending, setPending] = useState(false)

  const owner = github?.owner
  const repo = github?.repo
  const branch = github?.branch
  const viewKind = view.kind
  const viewPath = view.path

  useEffect(() => {
    if (viewKind !== "dir") return

    if (ingested.length > 0) {
      setEntries(entriesInDir(ingested, viewPath))
      setPending(false)
      return
    }

    if (!owner || !repo || !branch) return

    let cancelled = false
    setPending(true)
    setEntries(null)
    fetchGithubListing({ owner, repo, branch }, viewPath).then((next) => {
      if (cancelled) return
      setEntries(next)
      setPending(false)
    })
    return () => {
      cancelled = true
    }
  }, [ingested, owner, repo, branch, viewKind, viewPath])

  useEffect(() => {
    if (viewKind !== "file" || !owner || !repo || !branch) return

    let cancelled = false
    setPending(true)
    setFile(null)
    fetchGithubFile({ owner, repo, branch }, viewPath).then((next) => {
      if (cancelled) return
      setFile(next)
      setPending(false)
    })
    return () => {
      cancelled = true
    }
  }, [owner, repo, branch, viewKind, viewPath])

  if (!github && detail.files.length === 0) return null

  const trail = crumbs(view.path)

  function openDir(path: string) {
    setFile(null)
    setView({ kind: "dir", path })
  }

  function openEntry(entry: GithubEntry) {
    if (entry.kind === "dir") {
      openDir(entry.path)
      return
    }
    setView({ kind: "file", path: entry.path })
  }

  return (
    <Card className="project-module">
      <CardHeader className="border-b">
        <CardTitle>{t.files}</CardTitle>
        {view.kind === "file" && github ? (
          <CardAction>
            <Button
              render={
                <a
                  href={blobFileUrl(github, view.path)}
                  target="_blank"
                  rel="noreferrer"
                />
              }
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              {t.openOnGitHub}
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-0 pb-0">
        <nav className="flex flex-wrap items-center gap-1 border-b px-4 py-2 text-sm">
          {trail.map((crumb, index) => (
            <span key={crumb.path || "root"} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRightIcon className="size-3.5 text-muted-foreground" />
              ) : null}
              {index === trail.length - 1 ? (
                <span className="font-medium">
                  {crumb.label === "/" ? (github?.repo ?? t.files) : crumb.label}
                </span>
              ) : (
                <button
                  type="button"
                  className="text-muted-foreground hover:underline"
                  onClick={() => openDir(crumb.path)}
                >
                  {crumb.label === "/"
                    ? (github?.repo ?? t.files)
                    : crumb.label}
                </button>
              )}
            </span>
          ))}
        </nav>

        {view.kind === "dir" ? (
          <div className="project-tree max-h-[32rem] overflow-auto px-2 pb-2">
            {pending && !entries ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                {t.loading}
              </p>
            ) : entries && entries.length > 0 ? (
              <FileRows entries={entries} onOpen={openEntry} />
            ) : (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                {t.emptyFolder}
              </p>
            )}
          </div>
        ) : (
          <div className="max-h-[40rem] overflow-auto">
            {pending && !file ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                {t.loading}
              </p>
            ) : file && github ? (
              <FileBody github={github} view={file} />
            ) : (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                {t.fileUnavailable}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
