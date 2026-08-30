import { notFound } from "next/navigation"

import { ProfileSidebar } from "@/components/profile-sidebar"
import { ProjectsSection } from "@/components/projects-section"
import { isLocale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"
import { getProjects } from "@/lib/projects"
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
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="intro w-full">
          <ProfileSidebar locale={locale} t={t} />
        </div>
        <ProjectsSection locale={locale} t={t} projects={getProjects()} />
      </main>
    </div>
  )
}
