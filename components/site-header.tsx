import { LocaleToggle } from "@/components/locale-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Locale } from "@/lib/i18n/config"
import type { Messages } from "@/lib/i18n/messages"
import { site } from "@/lib/site"

export function SiteHeader({
  locale,
  t,
}: {
  readonly locale: Locale
  readonly t: Messages
}) {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 sm:px-6">
        <p className="text-sm font-medium">{site.name}</p>
        <div className="flex items-center gap-2">
          <LocaleToggle locale={locale} label={t.toggleLocale} />
          <ThemeToggle label={t.toggleTheme} />
        </div>
      </div>
    </header>
  )
}
