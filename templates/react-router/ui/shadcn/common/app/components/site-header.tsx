import { useEffect, useState } from "react"
import { Link } from "react-router"
import { features } from "@/lib/features"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(features.auth)

  useEffect(() => {
    if (!features.auth) return
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((j) => setUser(j.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-4 px-4">
        <Link to="/" className="font-semibold">
          {{PROJECT_NAME}}
        </Link>
        <nav className="flex items-center gap-3 text-sm text-muted-foreground">
          {features.storage ? (
            <Link to="/storage" className="hover:text-foreground">
              Storage
            </Link>
          ) : null}
          {features.email ? (
            <Link to="/email" className="hover:text-foreground">
              Email
            </Link>
          ) : null}
          {features.auth && user ? (
            <Link to="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
          ) : null}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <ThemeToggle />
          {features.auth ? (
            loading ? null : user ? (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
                <Button variant="outline" size="sm" onClick={() => void signOut()}>
                  Sign out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">Sign in</Button>
              </Link>
            )
          ) : null}
        </div>
      </div>
    </header>
  )
}
