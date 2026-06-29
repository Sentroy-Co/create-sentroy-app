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
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Apply the stored (or system) theme before paint — no flash of wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
        <Providers>
          <SiteHeader />
          <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
