"use client"

import Link from "next/link"
import { features } from "@/lib/features"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-4 px-4">
        <Link href="/" className="font-semibold">
          {{PROJECT_NAME}}
        </Link>
        <nav className="flex items-center gap-3 text-sm text-muted-foreground">
          {features.storage ? (
            <Link href="/storage" className="hover:text-foreground">
              Storage
            </Link>
          ) : null}
          {features.email ? (
            <Link href="/email" className="hover:text-foreground">
              Email
            </Link>
          ) : null}
          {user ? (
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
          ) : null}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <ThemeToggle />
          {isPending ? null : user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
              <Button variant="outline" size="sm" onClick={() => authClient.signOut().then(() => (window.location.href = "/"))}>
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
