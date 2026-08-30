import { notFound } from "next/navigation"

import { isLocale, localeHtmlLang, locales } from "@/lib/i18n/config"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(localeHtmlLang[locale])}`,
        }}
      />
      {children}
    </>
  )
}
