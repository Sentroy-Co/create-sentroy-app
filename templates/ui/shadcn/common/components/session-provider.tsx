"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

export interface SessionUser {
  id: string
  email: string
  emailVerified: boolean
  name: string | null
  picture: string | null
}

interface SessionContextValue {
  user: SessionUser | null
  loading: boolean
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

// Safe default so components work even when Auth isn't enabled (no provider).
const SessionContext = createContext<SessionContextValue>({
  user: null,
  loading: false,
  refresh: async () => {},
  signOut: async () => {},
})

export function useSession() {
  return useContext(SessionContext)
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/session", { cache: "no-store" })
      const j = (await r.json()) as { user: SessionUser | null }
      setUser(j.user ?? null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return <SessionContext.Provider value={{ user, loading, refresh, signOut }}>{children}</SessionContext.Provider>
}
