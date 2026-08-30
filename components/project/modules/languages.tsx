import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { linguistColor } from "@/lib/projects/linguist"
import type { LinguistShare } from "@/lib/projects"
import type { ProjectModule, ProjectModuleContext } from "@/components/project/modules/types"

function formatPercent(percent: number) {
  return `${percent.toFixed(1)}%`
}

function sharesFor(ctx: ProjectModuleContext): readonly LinguistShare[] {
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

function LanguagesSection(ctx: ProjectModuleContext) {
  const { t } = ctx
  const languages = sharesFor(ctx)
  if (languages.length === 0) return <></>

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
              <span className="min-w-0 truncate font-medium">{language.name}</span>
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

export const languagesModule: ProjectModule = {
  id: "languages",
  slot: "side",
  available: (ctx) =>
    ctx.detail.languages.length > 0 || ctx.project.languages.length > 0,
  Section: LanguagesSection,
}
