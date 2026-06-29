import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import { theme } from "@/theme"
import { SiteHeader } from "@/components/site-header"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{{PROJECT_NAME}}</title>
        <Meta />
        <Links />
        {/* Emotion SSR styles are injected here by entry.server.tsx */}
        {typeof document === "undefined" ? "__EMOTION_STYLES__" : null}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SiteHeader />
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}
