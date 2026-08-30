import type { Components } from "react-markdown"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import {
  htmlImagesToMarkdown,
  rewriteMediaUrl,
  type GithubRepoRef,
} from "@/lib/projects/github"

function componentsFor(ref: GithubRepoRef, dir: string): Components {
  return {
    a({ href, children }) {
      if (!href || href.startsWith("javascript:")) return <>{children}</>
      const resolved = rewriteMediaUrl(href, ref, dir)
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
      if (typeof src !== "string") return null
      const resolved = rewriteMediaUrl(src, ref, dir)
      if (!resolved) return null
      return (
        <img
          src={resolved}
          alt={alt ?? ""}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )
    },
  }
}

export function GithubMarkdown({
  markdown,
  github,
  dir = "",
}: {
  readonly markdown: string
  readonly github: GithubRepoRef
  readonly dir?: string
}) {
  const source = htmlImagesToMarkdown(markdown, github, dir)

  return (
    <div className="project-readme">
      <Markdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) => rewriteMediaUrl(url, github, dir)}
        components={componentsFor(github, dir)}
      >
        {source}
      </Markdown>
    </div>
  )
}
