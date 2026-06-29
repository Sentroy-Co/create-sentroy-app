import { NextResponse } from "next/server"
import { authApi, setSessionCookies, authConfigured } from "@/lib/auth-server"

interface SignupData {
  user?: unknown
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
  emailVerificationRequired?: boolean
  message?: string
}

export async function POST(req: Request) {
  if (!authConfigured()) return NextResponse.json({ error: "auth_not_configured" }, { status: 500 })
  const body = (await req.json().catch(() => ({}))) as { email?: string; password?: string; displayName?: string }
  if (!body.email || !body.password) return NextResponse.json({ error: "missing_fields" }, { status: 400 })

  const r = await authApi<SignupData>("/signup", {
    email: body.email,
    password: body.password,
    displayName: body.displayName,
  })
  if (!r.ok || !r.data) {
    return NextResponse.json(
      { error: r.error ?? "signup_failed", error_description: r.error_description },
      { status: r.status || 400 },
    )
  }
  // Either tokens are returned, or email verification is required first.
  if (r.data.accessToken && r.data.refreshToken) {
    await setSessionCookies({
      accessToken: r.data.accessToken,
      refreshToken: r.data.refreshToken,
      expiresIn: r.data.expiresIn,
    })
    return NextResponse.json({ user: r.data.user })
  }
  return NextResponse.json({
    emailVerificationRequired: true,
    message: r.data.message ?? "Check your inbox to verify your email.",
  })
}
