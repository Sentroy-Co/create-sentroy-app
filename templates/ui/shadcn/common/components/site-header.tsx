"use client"

import Link from "next/link"
import { features } from "@/lib/features"
import { useSession } from "@/components/session-provider"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const { user, loading, signOut } = useSession()
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
          {features.auth && user ? (
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
          ) : null}
        </nav>
        {features.auth ? (
          <div className="ms-auto flex items-center gap-2">
            {loading ? null : user ? (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
                <Button variant="outline" size="sm" onClick={() => void signOut()}>
                  Sign out
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Sign in</Button>
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </header>
  )
}
