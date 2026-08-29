import { ThemeToggle } from "@/components/theme-toggle"
import { site } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between">
      <p className="text-sm font-medium">{site.name}</p>
      <ThemeToggle />
    </header>
  )
}
