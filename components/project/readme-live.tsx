"use client"

import { useEffect, useState } from "react"

import { GithubMarkdown } from "@/components/project/github-markdown"
import type { ProjectModuleContext } from "@/components/project/modules/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  fetchGithubReadme,
  githubRef,
} from "@/lib/projects/github"

export function ReadmeLive({ project, detail, t }: ProjectModuleContext) {
  const github = githubRef(project, detail.branch)
  const owner = github?.owner
  const repo = github?.repo
  const branch = github?.branch
  const [markdown, setMarkdown] = useState(detail.readme)

  useEffect(() => {
    if (!owner || !repo || !branch) return
    let cancelled = false
    fetchGithubReadme({ owner, repo, branch }).then((next) => {
      if (cancelled || !next) return
      setMarkdown(next.text)
    })
    return () => {
      cancelled = true
    }
  }, [owner, repo, branch])

  if (!markdown) {
    if (!github) return null
    return (
      <Card className="project-module">
        <CardHeader className="border-b">
          <CardTitle>{t.readme}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t.loading}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="project-module">
      <CardHeader className="border-b">
        <CardTitle>{t.readme}</CardTitle>
      </CardHeader>
      <CardContent>
        {github ? (
          <GithubMarkdown markdown={markdown} github={github} />
        ) : (
          <div className="project-readme whitespace-pre-wrap">{markdown}</div>
        )}
      </CardContent>
    </Card>
  )
}
