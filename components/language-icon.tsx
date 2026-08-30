import type { SimpleIcon } from "simple-icons"
import {
  siC,
  siCplusplus,
  siCss,
  siDotnet,
  siHtml5,
  siJulia,
  siKotlin,
  siLlvm,
  siMarkdown,
  siRuby,
  siRust,
  siTypescript,
} from "simple-icons"

import { cn } from "@/lib/utils"

const files: Record<string, { src: string; wide?: boolean }> = {
  "Jupyter Notebook": { src: "/languages/jupyter.svg" },
  Java: { src: "/languages/java.svg" },
  TeX: { src: "/languages/tex.svg", wide: true },
  JavaScript: { src: "/languages/javascript.png" },
  Dart: { src: "/languages/dart.png" },
  Python: { src: "/languages/python.png" },
  SQL: { src: "/languages/sql.png", wide: true },
}

const icons: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  HTML: siHtml5,
  CSS: siCss,
  Rust: siRust,
  "C++": siCplusplus,
  C: siC,
  "C#": siDotnet,
  Julia: siJulia,
  Assembly: siLlvm,
  Markdown: siMarkdown,
  Kotlin: siKotlin,
  Ruby: siRuby,
}

export function LanguageIcon({
  language,
}: {
  readonly language: string
}) {
  const file = files[language]
  if (file) {
    return (
      <img
        src={file.src}
        alt=""
        className={cn(
          "shrink-0 object-contain",
          file.wide ? "h-5 w-8" : "size-5"
        )}
      />
    )
  }

  const icon = icons[language]
  if (!icon) return null

  const fill = icon.hex === "000000" ? "currentColor" : `#${icon.hex}`

  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
      <path fill={fill} d={icon.path} />
    </svg>
  )
}
