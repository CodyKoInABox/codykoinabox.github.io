import { ArrowLeftIcon } from "lucide-react"

import { modulesInSlot } from "@/components/project/modules"
import type { ProjectModuleContext } from "@/components/project/modules/types"
import { LocaleToggle } from "@/components/locale-toggle"
import { LanguageIcon } from "@/components/language-icon"
import { GitHubLogo } from "@/components/social-icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { kindLabel } from "@/lib/projects/labels"
import { localePath } from "@/lib/i18n/locale"
import { localized } from "@/lib/projects"

function renderSlot(
  ctx: ProjectModuleContext,
  slot: "preview" | "main" | "side"
) {
  return modulesInSlot(slot)
    .filter((mod) => mod.available(ctx))
    .map((mod) => <mod.Section key={mod.id} {...ctx} />)
}

export function ProjectView(ctx: ProjectModuleContext) {
  const { locale, t, project } = ctx
  const title = localized(project.title, locale)
  const summary = localized(project.summary, locale)
  const preview = renderSlot(ctx, "preview")
  const main = renderSlot(ctx, "main")
  const side = renderSlot(ctx, "side")

  return (
    <div className="flex min-h-svh flex-col">
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <Button
            render={<a href={localePath(locale)} />}
            nativeButton={false}
            variant="ghost"
            size="sm"
          >
            <ArrowLeftIcon data-icon="inline-start" />
            {t.backToProjects}
          </Button>
          <div className="flex shrink-0 items-center gap-2">
            <LocaleToggle
              locale={locale}
              label={t.toggleLocale}
              rest={`/projects/${project.slug}/`}
            />
            <ThemeToggle label={t.toggleTheme} />
          </div>
        </header>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {summary ? (
                <p className="text-muted-foreground">{summary}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="outline">{kindLabel(project.kind, t)}</Badge>
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
                  variant="outline"
                  size="icon-sm"
                >
                  <GitHubLogo />
                </Button>
              ) : null}
            </div>
          </div>
          {project.languages.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {project.languages.map((language) => (
                <span
                  key={language}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <LanguageIcon language={language} />
                  {language}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {preview}

        {side.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="flex min-w-0 flex-col gap-6">{main}</div>
            <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
              {side}
            </aside>
          </div>
        ) : (
          <div className="flex flex-col gap-6">{main}</div>
        )}
      </main>
    </div>
  )
}
