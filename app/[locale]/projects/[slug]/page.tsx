import { notFound } from "next/navigation"

import { ProjectView } from "@/components/project/project-view"
import { isLocale, locales } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"
import { getProjectDetail } from "@/lib/projects/detail"
import { getProject, getProjects, localized } from "@/lib/projects"
import { site } from "@/lib/site"

export function generateStaticParams() {
  return getProjects().flatMap((project) =>
    locales.map((locale) => ({ locale, slug: project.slug }))
  )
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}

  const project = getProject(slug)
  if (!project) return {}

  const summary = localized(project.summary, locale)
  return {
    title: `${localized(project.title, locale)} · ${site.name}`,
    description: summary || `${site.fullName}. ${getMessages(locale).personalPortfolio}`,
  }
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const project = getProject(slug)
  if (!project) {
    notFound()
  }

  const t = getMessages(locale)
  const detail = await getProjectDetail(slug)

  return (
    <ProjectView locale={locale} t={t} project={project} detail={detail} />
  )
}
