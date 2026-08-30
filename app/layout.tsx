import type { Metadata } from "next"
import { Geist } from "next/font/google"

import { cn } from "@/lib/utils"
import { site } from "@/lib/site"
import { themeInitScript } from "@/lib/theme"

import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: site.name,
  description: site.fullName,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-svh bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
