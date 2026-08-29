import { HomeIntro } from "@/components/home-intro"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-lg flex-col px-6 py-8">
      <SiteHeader />
      <HomeIntro />
    </div>
  )
}
