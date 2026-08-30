import type { Components } from "react-markdown"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Project } from "@/lib/projects"
import type { ProjectModule, ProjectModuleContext } from "@/components/project/modules/types"

function rawBase(project: Project, branch: string) {
  if (project.source.type !== "github") return null
  return `https://raw.githubusercontent.com/${project.source.owner}/${project.source.repo}/${branch}/`
}

function resolveUrl(src: string | undefined, base: string | null) {
  if (!src) return src
  if (/^(https?:|data:|mailto:|#)/i.test(src)) return src
  if (!base) return src
  try {
    return new URL(src.replace(/^\.\//, ""), base).href
  } catch {
    return src
  }
}

function markdownComponents(base: string | null): Components {
  return {
    a({ href, children }) {
      if (!href || href.startsWith("javascript:")) return <>{children}</>
      const resolved = resolveUrl(href, base) ?? href
      const external = /^https?:\/\//i.test(resolved)
      return (
        <a
          href={resolved}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {children}
        </a>
      )
    },
    img({ src, alt }) {
      const resolved = resolveUrl(typeof src === "string" ? src : undefined, base)
      if (!resolved) return null
      return <img src={resolved} alt={alt ?? ""} />
    },
  }
}

function ReadmeSection({ t, project, detail }: ProjectModuleContext) {
  if (!detail.readme) return <></>

  return (
    <Card className="project-module">
      <CardHeader className="border-b">
        <CardTitle>{t.readme}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="project-readme">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents(rawBase(project, detail.branch))}
          >
            {detail.readme}
          </Markdown>
        </div>
      </CardContent>
    </Card>
  )
}

export const readmeModule: ProjectModule = {
  id: "readme",
  slot: "main",
  available: (ctx) => Boolean(ctx.detail.readme),
  Section: ReadmeSection,
}
