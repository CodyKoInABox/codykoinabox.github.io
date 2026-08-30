import { FileIcon, FolderIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { buildFileTree, type FileTreeNode } from "@/lib/projects/tree"
import type { ProjectModule, ProjectModuleContext } from "@/components/project/modules/types"

function TreeList({
  nodes,
}: {
  readonly nodes: readonly FileTreeNode[]
}) {
  return (
    <ul className="flex flex-col">
      {nodes.map((node) => (
        <li key={`${node.kind}-${node.name}`}>
          {node.kind === "dir" ? (
            <details>
              <summary className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
                <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{node.name}</span>
              </summary>
              <div className="ms-4 border-s border-border ps-1">
                <TreeList nodes={node.children} />
              </div>
            </details>
          ) : (
            <div className="flex items-center gap-2 rounded-md px-2 py-1">
              <FileIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{node.name}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

function FileTreeSection({ t, detail }: ProjectModuleContext) {
  if (detail.files.length === 0) return <></>

  const tree = buildFileTree(detail.files)

  return (
    <Card className="project-module">
      <CardHeader className="border-b">
        <CardTitle>{t.files}</CardTitle>
      </CardHeader>
      <CardContent className="project-tree max-h-[32rem] overflow-auto py-2 text-sm">
        <TreeList nodes={tree} />
        {detail.truncated ? (
          <p className="px-2 pt-2 text-xs text-muted-foreground">
            {t.filesTruncated}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

export const fileTreeModule: ProjectModule = {
  id: "files",
  slot: "main",
  available: (ctx) => ctx.detail.files.length > 0,
  Section: FileTreeSection,
}
