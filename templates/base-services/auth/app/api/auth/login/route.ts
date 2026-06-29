import { NextResponse } from "next/server"
import { authApi, setSessionCookies, authConfigured } from "@/lib/auth-server"

interface LoginData {
  user?: unknown
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
  mfaRequired?: boolean
  mfaToken?: string
  factorType?: string
}

export async function POST(req: Request) {
  if (!authConfigured()) return NextResponse.json({ error: "auth_not_configured" }, { status: 500 })
  const body = (await req.json().catch(() => ({}))) as { email?: string; password?: string; rememberMe?: boolean }
  if (!body.email || !body.password) return NextResponse.json({ error: "missing_fields" }, { status: 400 })

  const r = await authApi<LoginData>("/login", {
    email: body.email,
    password: body.password,
    rememberMe: Boolean(body.rememberMe),
  })
  if (!r.ok || !r.data) {
    return NextResponse.json(
      { error: r.error ?? "login_failed", error_description: r.error_description },
      { status: r.status || 400 },
    )
  }
  if (r.data.mfaRequired) {
    return NextResponse.json({ mfaRequired: true, mfaToken: r.data.mfaToken, factorType: r.data.factorType })
  }
  await setSessionCookies({
    accessToken: r.data.accessToken!,
    refreshToken: r.data.refreshToken!,
    expiresIn: r.data.expiresIn,
  })
  return NextResponse.json({ user: r.data.user })
}
