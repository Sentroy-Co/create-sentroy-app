import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "{{PROJECT_NAME}}",
  description: "Built with Sentroy — Auth, Storage and Email.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SiteHeader />
          <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
