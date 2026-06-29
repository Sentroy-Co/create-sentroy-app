import type { Metadata } from "next"
import "./globals.css"
import Container from "@mui/material/Container"
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
          <Container maxWidth="sm" sx={{ py: 5 }}>
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  )
}
