import { ExternalLinkIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ProjectModule, ProjectModuleContext } from "@/components/project/modules/types"

function SitePreviewSection({ t, detail }: ProjectModuleContext) {
  const url = detail.site?.url
  if (!url) return <></>

  return (
    <Card className="project-module">
      <CardHeader className="border-b">
        <CardTitle>{t.liveSite}</CardTitle>
        <CardAction>
          <Button
            render={<a href={url} target="_blank" rel="noreferrer" />}
            nativeButton={false}
            variant="outline"
            size="sm"
          >
            {t.openSite}
            <ExternalLinkIcon data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-hidden">
          <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2">
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="min-w-0 truncate text-xs text-muted-foreground hover:underline"
            >
              {url}
            </a>
          </div>
          <iframe
            src={url}
            title={t.liveSite}
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
            className="h-[28rem] w-full bg-muted"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export const sitePreviewModule: ProjectModule = {
  id: "site",
  slot: "preview",
  available: (ctx) => ctx.detail.site !== null,
  Section: SitePreviewSection,
}
