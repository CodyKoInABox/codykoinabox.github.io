import { ArrowRightIcon } from "lucide-react"

import { LanguageIcon } from "@/components/language-icon"
import { GitHubLogo } from "@/components/social-icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Locale } from "@/lib/i18n/config"
import type { Messages } from "@/lib/i18n/messages"
import { kindLabel } from "@/lib/projects/labels"
import { localized, projectPath, type Project } from "@/lib/projects"

export function ProjectCard({
  locale,
  t,
  project,
}: {
  readonly locale: Locale
  readonly t: Messages
  readonly project: Project
}) {
  const title = localized(project.title, locale)
  const summary = localized(project.summary, locale)
  const href = projectPath(locale, project.slug)
  const language = project.languages[0]

  return (
    <Card className="project-card relative h-full min-w-0 cursor-pointer ring-foreground/10 motion-safe:transition-[translate,box-shadow,background-color] motion-safe:duration-200 hover:bg-muted/40 hover:ring-foreground/25 motion-safe:hover:-translate-y-0.5">
      <a href={href} className="absolute inset-0" tabIndex={-1}>
        <span className="sr-only">{t.viewProject}</span>
      </a>
      <CardHeader className="pointer-events-none flex-1">
        <CardTitle className="text-lg">{title}</CardTitle>
        {summary ? (
          <CardDescription className="line-clamp-3">{summary}</CardDescription>
        ) : null}
        <CardAction>
          <Badge variant="outline">{kindLabel(project.kind, t)}</Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="relative mt-auto justify-between gap-2 pointer-events-none">
        <Button
          render={<a href={href} aria-label={t.viewProject} />}
          nativeButton={false}
          variant="outline"
          size="sm"
          className="pointer-events-auto"
        >
          {t.viewProject}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <div className="pointer-events-auto flex shrink-0 items-center gap-1">
          {language ? (
            <Tooltip>
              <TooltipTrigger
                nativeButton={false}
                render={
                  <span className="flex size-8 items-center justify-center" />
                }
              >
                <LanguageIcon language={language} />
              </TooltipTrigger>
              <TooltipContent>{language}</TooltipContent>
            </Tooltip>
          ) : null}
          {project.source.type === "github" ? (
            <Button
              render={
                <a
                  href={project.source.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t.openOnGitHub}
                />
              }
              nativeButton={false}
              variant="ghost"
              size="icon-sm"
            >
              <GitHubLogo />
            </Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  )
}
