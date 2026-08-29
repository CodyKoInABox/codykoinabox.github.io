export const COLOR_SCHEME_KEY = "color-scheme"

export type ColorScheme = "light" | "dark"

export function isColorScheme(value: string | null): value is ColorScheme {
  return value === "light" || value === "dark"
}

export function getSystemScheme(): ColorScheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function getStoredScheme(): ColorScheme | null {
  const stored = localStorage.getItem(COLOR_SCHEME_KEY)
  return isColorScheme(stored) ? stored : null
}

export function applyColorScheme(scheme: ColorScheme, persist: boolean) {
  document.documentElement.classList.remove("light", "dark")
  document.documentElement.classList.add(scheme)

  const meta = document.querySelector('meta[name="color-scheme"]')
  if (meta) {
    meta.setAttribute("content", persist ? scheme : "light dark")
  }

  if (persist) {
    localStorage.setItem(COLOR_SCHEME_KEY, scheme)
    return
  }

  localStorage.removeItem(COLOR_SCHEME_KEY)
}

export const themeInitScript = `{
  const stored = localStorage.getItem("${COLOR_SCHEME_KEY}");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const scheme = stored === "light" || stored === "dark"
    ? stored
    : prefersDark ? "dark" : "light";
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta && (stored === "light" || stored === "dark")) {
    meta.setAttribute("content", stored);
  }
  document.documentElement.classList.add(scheme);
}`
