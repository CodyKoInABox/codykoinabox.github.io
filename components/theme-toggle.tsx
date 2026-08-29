"use client"

import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  applyColorScheme,
  getStoredScheme,
  getSystemScheme,
  type ColorScheme,
} from "@/lib/theme"

export function ThemeToggle() {
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

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={scheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {scheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
