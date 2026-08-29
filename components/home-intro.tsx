import { Button } from "@/components/ui/button"
import { site } from "@/lib/site"

export function HomeIntro() {
  return (
    <main className="intro flex flex-1 flex-col justify-center py-16">
      <p className="text-sm text-muted-foreground">{site.fullName}</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight">{site.tagline}</h1>
      <p className="mt-4 max-w-md text-muted-foreground">{site.bio}</p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Button
          render={<a href={site.github} target="_blank" rel="noreferrer" />}
          nativeButton={false}
          variant="outline"
        >
          GitHub
        </Button>
        <Button
          render={<a href={site.linkedin} target="_blank" rel="noreferrer" />}
          nativeButton={false}
          variant="outline"
        >
          LinkedIn
        </Button>
      </div>
    </main>
  )
}
