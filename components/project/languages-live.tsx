"use client"

import { useEffect, useState } from "react"

import type { ProjectModuleContext } from "@/components/project/modules/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  fetchGithubLanguages,
  githubRef,
} from "@/lib/projects/github"
import { linguistColor, linguistShares } from "@/lib/projects/linguist"
import type { LinguistShare } from "@/lib/projects"

function formatPercent(percent: number) {
  return `${percent.toFixed(1)}%`
}

function fallbackShares(ctx: ProjectModuleContext): readonly LinguistShare[] {
  if (ctx.detail.languages.length > 0) return ctx.detail.languages
  const names = ctx.project.languages
  if (names.length === 0) return []
  const percent = 100 / names.length
  return names.map((name) => ({
    name,
    bytes: 0,
    percent,
    color: linguistColor(name),
  }))
}

export function LanguagesLive(ctx: ProjectModuleContext) {
  const { t, project, detail } = ctx
  const github = githubRef(project, detail.branch)
  const owner = github?.owner
  const repo = github?.repo
  const branch = github?.branch
  const [languages, setLanguages] = useState<readonly LinguistShare[]>(
    fallbackShares(ctx)
  )

  useEffect(() => {
    if (!owner || !repo || !branch) return
    let cancelled = false
    fetchGithubLanguages({ owner, repo, branch }).then((bytes) => {
      if (cancelled || !bytes) return
      setLanguages(linguistShares(bytes))
    })
    return () => {
      cancelled = true
    }
  }, [owner, repo, branch])

  if (languages.length === 0) return null

  const label = languages
    .map((language) => `${language.name} ${formatPercent(language.percent)}`)
    .join(", ")

  return (
    <Card className="project-module">
      <CardHeader>
        <CardTitle>{t.languages}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div
          className="flex h-2 overflow-hidden rounded-full"
          role="img"
          aria-label={label}
        >
          {languages.map((language) => (
            <span
              key={language.name}
              className="h-full min-w-px"
              style={{
                width: `${language.percent}%`,
                backgroundColor: language.color,
              }}
            />
          ))}
        </div>
        <ul className="flex flex-col gap-1.5">
          {languages.map((language) => (
            <li
              key={language.name}
              className="flex items-center gap-2 text-sm"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: language.color }}
              />
              <span className="min-w-0 truncate font-medium">
                {language.name}
              </span>
              <span className="ms-auto text-muted-foreground">
                {formatPercent(language.percent)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
