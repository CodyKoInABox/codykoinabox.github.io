import linguistColors from "@/lib/projects/linguist-colors.json"

const FALLBACK = "#858585"

const colors: Record<string, string> = linguistColors

export function linguistColor(name: string) {
  return colors[name] ?? FALLBACK
}

export function linguistShares(bytesByLanguage: Record<string, number>) {
  const entries = Object.entries(bytesByLanguage)
    .filter(([, bytes]) => bytes > 0)
    .sort((a, b) => b[1] - a[1])

  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0)
  if (total === 0) return []

  return entries.map(([name, bytes]) => ({
    name,
    bytes,
    percent: (bytes / total) * 100,
    color: linguistColor(name),
  }))
}
