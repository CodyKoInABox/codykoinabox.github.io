"use client"

import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import {
  applyColorScheme,
  getStoredScheme,
  getSystemScheme,
  type ColorScheme,
} from "@/lib/theme"

export function ThemeToggle({ label }: { readonly label: string }) {
  const [scheme, setScheme] = useState<ColorScheme | null>(null)

  useEffect(() => {
    setScheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    )

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      if (getStoredScheme()) return
      const next = getSystemScheme()
      applyColorScheme(next, false)
      setScheme(next)
    }

    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  function toggle() {
    const current =
      scheme ??
      (document.documentElement.classList.contains("dark") ? "dark" : "light")
    const next = current === "dark" ? "light" : "dark"
    applyColorScheme(next, true)
    setScheme(next)
  }

  const isDark = scheme === "dark"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      onClick={toggle}
      className="relative isolate flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full bg-muted p-1"
    >
      <span className="pointer-events-none absolute top-1 left-1 size-6 rounded-full bg-background shadow-sm motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out dark:translate-x-8" />
      <span className="relative z-10 flex flex-1 items-center justify-center text-foreground dark:text-muted-foreground">
        <SunIcon className="size-3.5" />
      </span>
      <span className="relative z-10 flex flex-1 items-center justify-center text-muted-foreground dark:text-foreground">
        <MoonIcon className="size-3.5" />
      </span>
    </button>
  )
}
