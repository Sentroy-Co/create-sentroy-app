import { NextResponse } from "next/server"
import { authApi, authConfigured } from "@/lib/auth-server"

// Requests a password-reset email. Always returns ok (enumeration-safe).
export async function POST(req: Request) {
  if (!authConfigured()) return NextResponse.json({ error: "auth_not_configured" }, { status: 500 })
  const body = (await req.json().catch(() => ({}))) as { email?: string }
  if (!body.email) return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  await authApi("/password-reset/request", { email: body.email })
  return NextResponse.json({ ok: true })
}
