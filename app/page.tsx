import { localeRedirectScript } from "@/lib/i18n/locale"

export default function RootPage() {
  return (
    <main className="p-6 text-sm text-muted-foreground">
      <script dangerouslySetInnerHTML={{ __html: localeRedirectScript }} />
      <a href="/en/" className="hover:underline">
        English
      </a>
      {" · "}
      <a href="/pt/" className="hover:underline">
        Português
      </a>
    </main>
  )
}
