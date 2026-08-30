export type FileTreeNode =
  | { readonly kind: "file"; readonly name: string }
  | {
      readonly kind: "dir"
      readonly name: string
      readonly children: readonly FileTreeNode[]
    }

type MutableDir = {
  kind: "dir"
  name: string
  children: Array<MutableDir | { kind: "file"; name: string }>
}

function compareName(a: { name: string }, b: { name: string }) {
  return a.name.localeCompare(b.name)
}

function freeze(nodes: MutableDir["children"]): FileTreeNode[] {
  const dirs = nodes.filter((node) => node.kind === "dir")
  const files = nodes.filter((node) => node.kind === "file")
  dirs.sort(compareName)
  files.sort(compareName)
  return [
    ...dirs.map((dir) => ({
      kind: "dir" as const,
      name: dir.name,
      children: freeze(dir.children),
    })),
    ...files.map((file) => ({ kind: "file" as const, name: file.name })),
  ]
}

export function buildFileTree(files: readonly string[]): FileTreeNode[] {
  const root: MutableDir = { kind: "dir", name: "", children: [] }

  for (const file of files) {
    const segments = file.split("/").filter(Boolean)
    const fileName = segments.at(-1)
    if (!fileName) continue

    let dir = root
    for (const segment of segments.slice(0, -1)) {
      const existing = dir.children.find(
        (child) => child.kind === "dir" && child.name === segment
      )
      if (existing && existing.kind === "dir") {
        dir = existing
        continue
      }
      const created: MutableDir = { kind: "dir", name: segment, children: [] }
      dir.children.push(created)
      dir = created
    }

    if (!dir.children.some((child) => child.kind === "file" && child.name === fileName)) {
      dir.children.push({ kind: "file", name: fileName })
    }
  }

  return freeze(root.children)
}
