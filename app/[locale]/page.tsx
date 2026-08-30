import { notFound } from "next/navigation"

import { ProfileSidebar } from "@/components/profile-sidebar"
import { isLocale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"
import { site } from "@/lib/site"

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const t = getMessages(locale)
  return {
    title: site.name,
    description: `${site.fullName}. ${t.personalPortfolio}`,
  }
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const t = getMessages(locale)

  return (
    <div className="flex min-h-svh flex-col">
      <main className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
        <div className="intro w-full">
          <ProfileSidebar locale={locale} t={t} />
        </div>
      </main>
    </div>
  )
}
