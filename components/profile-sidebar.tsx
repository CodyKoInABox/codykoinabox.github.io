import { MailIcon } from "lucide-react"

import { LocaleToggle } from "@/components/locale-toggle"
import { GitHubLogo, LinkedInLogo, WhatsAppLogo } from "@/components/social-icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Locale } from "@/lib/i18n/config"
import type { Messages } from "@/lib/i18n/messages"
import { site } from "@/lib/site"

export function ProfileSidebar({
  locale,
  t,
}: {
  readonly locale: Locale
  readonly t: Messages
}) {
  return (
    <aside className="flex flex-col gap-6">
      <div className="flex items-start gap-4 sm:gap-8">
        <Avatar className="size-20 shrink-0 sm:size-72">
          <AvatarImage
            src={site.avatar}
            alt={site.fullName}
            width={460}
            height={460}
            fetchPriority="high"
          />
          <AvatarFallback>CK</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-5 sm:min-h-72 sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {site.fullName} / {site.name}
            </h1>
            <p className="text-lg text-muted-foreground">{site.tagline}</p>
          </div>

          <Separator />

          <section className="flex flex-col gap-2.5">
            <h2 className="text-lg font-medium">{t.contact}</h2>
            <ul className="flex flex-col gap-2.5 text-base">
              <li className="flex items-center gap-2.5">
                <MailIcon className="size-5 shrink-0 text-muted-foreground" />
                <a href={`mailto:${site.email}`} className="hover:underline">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
                  <WhatsAppLogo className="size-5" />
                </span>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {site.whatsapp}
                </a>
              </li>
            </ul>
          </section>

          <Separator />

          <div className="flex items-center gap-3">
            <Button
              render={<a href={site.website} target="_blank" rel="noreferrer" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="h-12 px-4 text-base"
            >
              {t.personalPortfolio}
            </Button>
            <Button
              render={<a href={site.github} target="_blank" rel="noreferrer" />}
              nativeButton={false}
              variant="outline"
              size="icon-lg"
              className="size-12 [&_svg:not([class*='size-'])]:size-6"
              aria-label="GitHub"
            >
              <GitHubLogo />
            </Button>
            <Button
              render={<a href={site.linkedin} target="_blank" rel="noreferrer" />}
              nativeButton={false}
              variant="outline"
              size="icon-lg"
              className="size-12 [&_svg:not([class*='size-'])]:size-6"
              aria-label="LinkedIn"
            >
              <LinkedInLogo />
            </Button>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <LocaleToggle locale={locale} label={t.toggleLocale} />
          <ThemeToggle label={t.toggleTheme} />
        </div>
      </div>

      <Separator className="data-horizontal:h-[2px]" />
    </aside>
  )
}
