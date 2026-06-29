import { NextResponse } from "next/server"
import { getSessionWithRefresh } from "@/lib/session"

// Client-facing "who am I" endpoint. Verifies the access token, transparently
// refreshing it (and rotating cookies) when expired. Returns { user: null }
// when signed out (200, so the client can branch without try/catch).
export async function GET() {
  const user = await getSessionWithRefresh()
  return NextResponse.json({ user: user ?? null })
}
