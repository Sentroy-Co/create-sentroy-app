import Link from "next/link"
import { features } from "@/lib/features"
import { Card, CardContent } from "@/components/ui/card"

const items = [
  features.auth ? { href: "/login", title: "Auth", desc: "Sign up & sign in your users." } : null,
  features.storage ? { href: "/storage", title: "Storage", desc: "Upload & list files." } : null,
  features.email ? { href: "/email", title: "Email", desc: "Send transactional email." } : null,
].filter(Boolean) as { href: string; title: string; desc: string }[]

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{{PROJECT_NAME}}</h1>
        <p className="mt-2 text-muted-foreground">
          Your Sentroy-powered app is ready. Fill in <code className="rounded bg-muted px-1">.env.local</code> and explore the wired services.
        </p>
      </div>
      {items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((it) => (
            <Link key={it.href} href={it.href}>
              <Card className="transition-colors hover:border-ring">
                <CardContent className="p-5">
                  <div className="font-semibold">{it.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{it.desc}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No Sentroy services were selected at scaffold time.</p>
      )}
    </div>
  )
}
