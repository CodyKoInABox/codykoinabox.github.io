"use client"

import { persistLocale } from "@/lib/i18n/locale"
import type { Locale } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

export function LocaleToggle({
  locale,
  label,
}: {
  readonly locale: Locale
  readonly label: string
}) {
  const isPt = locale === "pt"

  function toggle() {
    const next: Locale = isPt ? "en" : "pt"
    persistLocale(next)
    window.location.assign(`/${next}/`)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isPt}
      aria-label={label}
      onClick={toggle}
      className="relative isolate flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full bg-muted p-1 text-[0.65rem] font-medium tracking-wide"
    >
      <span
        className={cn(
          "pointer-events-none absolute top-1 left-1 size-6 rounded-full bg-background shadow-sm motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out",
          isPt && "translate-x-8"
        )}
      />
      <span
        className={cn(
          "relative z-10 flex flex-1 items-center justify-center",
          isPt ? "text-muted-foreground" : "text-foreground"
        )}
      >
        EN
      </span>
      <span
        className={cn(
          "relative z-10 flex flex-1 items-center justify-center",
          isPt ? "text-foreground" : "text-muted-foreground"
        )}
      >
        BR
      </span>
    </button>
  )
}
