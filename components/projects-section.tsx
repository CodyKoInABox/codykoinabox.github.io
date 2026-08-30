"use client"

import { useMemo, useState } from "react"
import { SearchXIcon } from "lucide-react"

import { ProjectCard } from "@/components/project-card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { Locale } from "@/lib/i18n/config"
import type { Messages } from "@/lib/i18n/messages"
import { kindLabel } from "@/lib/projects/labels"
import {
  filterProjects,
  presentKinds,
  presentLanguages,
  type Project,
  type ProjectKind,
} from "@/lib/projects"

const ALL = "all"

export function ProjectsSection({
  locale,
  t,
  projects,
}: {
  readonly locale: Locale
  readonly t: Messages
  readonly projects: readonly Project[]
}) {
  const [kind, setKind] = useState<typeof ALL | ProjectKind>(ALL)
  const [language, setLanguage] = useState(ALL)

  const kinds = useMemo(() => presentKinds(projects), [projects])
  const languages = useMemo(() => presentLanguages(projects), [projects])

  const languageItems = useMemo(
    () => [
      { label: t.filterAll, value: ALL },
      ...languages.map((name) => ({ label: name, value: name })),
    ],
    [languages, t.filterAll]
  )

  const visible = useMemo(
    () =>
      filterProjects({
        projects,
        kind: kind === ALL ? undefined : kind,
        language: language === ALL ? undefined : language,
      }),
    [projects, kind, language]
  )

  return (
    <section className="flex flex-col gap-4" aria-labelledby="projects-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="projects-heading" className="text-lg font-medium">
          {t.projects}
          <span className="ms-2 text-muted-foreground">{visible.length}</span>
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <ToggleGroup
            variant="outline"
            size="sm"
            value={[kind]}
            onValueChange={(next) => {
              const value = next[0]
              setKind(
                value === ALL || value === undefined
                  ? ALL
                  : (value as ProjectKind)
              )
            }}
            className="flex-wrap"
          >
            <ToggleGroupItem value={ALL}>{t.filterAll}</ToggleGroupItem>
            {kinds.map((item) => (
              <ToggleGroupItem key={item} value={item}>
                {kindLabel(item, t)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select
            items={languageItems}
            value={language}
            onValueChange={(value) => {
              if (typeof value === "string") setLanguage(value)
            }}
          >
            <SelectTrigger
              size="sm"
              className="w-full sm:w-44"
              aria-label={t.filterLanguage}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="end">
              <SelectGroup>
                {languageItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {visible.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle>{t.projectsEmpty}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] gap-5">
          {visible.map((project) => (
            <ProjectCard
              key={project.slug}
              locale={locale}
              t={t}
              project={project}
            />
          ))}
        </div>
      )}
    </section>
  )
}
