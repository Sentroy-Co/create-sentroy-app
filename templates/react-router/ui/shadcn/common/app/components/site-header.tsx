import { useEffect, useState } from "react"
import { Link } from "react-router"
import { features } from "@/lib/features"
import { Button } from "@/components/ui/button"

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
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-4 px-4">
        <Link to="/" className="font-semibold">
          {{PROJECT_NAME}}
        </Link>
        <nav className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
          {features.storage ? (
            <Link to="/storage" className="hover:text-neutral-900 dark:hover:text-neutral-50">
              Storage
            </Link>
          ) : null}
          {features.email ? (
            <Link to="/email" className="hover:text-neutral-900 dark:hover:text-neutral-50">
              Email
            </Link>
          ) : null}
          {features.auth && user ? (
            <Link to="/dashboard" className="hover:text-neutral-900 dark:hover:text-neutral-50">
              Dashboard
            </Link>
          ) : null}
        </nav>
        {features.auth ? (
          <div className="ms-auto flex items-center gap-2">
            {loading ? null : user ? (
              <>
                <span className="hidden text-sm text-neutral-500 sm:inline">{user.email}</span>
                <Button variant="outline" size="sm" onClick={() => void signOut()}>
                  Sign out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">Sign in</Button>
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </header>
  )
}
