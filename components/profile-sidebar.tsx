import { MailIcon, MessageCircleIcon } from "lucide-react"

import { GitHubLogo, LinkedInLogo } from "@/components/social-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Messages } from "@/lib/i18n/messages"
import { site } from "@/lib/site"

export function ProfileSidebar({ t }: { readonly t: Messages }) {
  return (
    <aside className="flex flex-col gap-4">
      <div className="flex items-center gap-4 sm:flex-col sm:items-stretch">
        <Avatar className="size-20 sm:size-auto sm:aspect-square sm:w-full">
          <AvatarImage
            src={site.avatar}
            alt={site.fullName}
            width={460}
            height={460}
            fetchPriority="high"
          />
          <AvatarFallback>CK</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {site.fullName}
          </h1>
          <p className="text-lg text-muted-foreground">{site.name}</p>
        </div>
      </div>

      <Button
        render={<a href={site.website} target="_blank" rel="noreferrer" />}
        nativeButton={false}
        variant="outline"
        className="w-full"
      >
        {t.personalPortfolio}
      </Button>

      <Separator />

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">{t.contact}</h2>
        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex items-center gap-2">
            <MailIcon className="size-4 shrink-0 text-muted-foreground" />
            <a href={`mailto:${site.email}`} className="hover:underline">
              {site.email}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <MessageCircleIcon className="size-4 shrink-0 text-muted-foreground" />
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

      <div className="flex gap-2">
        <Button
          render={<a href={site.github} target="_blank" rel="noreferrer" />}
          nativeButton={false}
          variant="outline"
          size="icon"
          aria-label="GitHub"
        >
          <GitHubLogo />
        </Button>
        <Button
          render={<a href={site.linkedin} target="_blank" rel="noreferrer" />}
          nativeButton={false}
          variant="outline"
          size="icon"
          aria-label="LinkedIn"
        >
          <LinkedInLogo />
        </Button>
      </div>
    </aside>
  )
}
