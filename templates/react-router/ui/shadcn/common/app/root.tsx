import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import type { LinksFunction } from "react-router"
import stylesheet from "./app.css?url"
import { SiteHeader } from "@/components/site-header"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{{PROJECT_NAME}}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
