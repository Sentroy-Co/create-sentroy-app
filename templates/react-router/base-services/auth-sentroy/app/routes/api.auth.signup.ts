import { authApi, authConfigured } from "@/lib/auth-server.server"
import { commitTokens } from "@/lib/session.server"

interface SignupData {
  user?: unknown
  accessToken?: string
  refreshToken?: string
  emailVerificationRequired?: boolean
  message?: string
}

export async function action({ request }: { request: Request }) {
  if (!authConfigured()) return Response.json({ error: "auth_not_configured" }, { status: 500 })
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string; displayName?: string }
  if (!body.email || !body.password) return Response.json({ error: "missing_fields" }, { status: 400 })

  const r = await authApi<SignupData>("/signup", {
    email: body.email,
    password: body.password,
    displayName: body.displayName,
  })
  if (!r.ok || !r.data) {
    return Response.json({ error: r.error ?? "signup_failed", error_description: r.error_description }, { status: r.status || 400 })
  }
  if (r.data.accessToken && r.data.refreshToken) {
    const setCookie = await commitTokens(request, { accessToken: r.data.accessToken, refreshToken: r.data.refreshToken })
    return Response.json({ user: r.data.user }, { headers: { "Set-Cookie": setCookie } })
  }
  return Response.json({ emailVerificationRequired: true, message: r.data.message ?? "Check your inbox to verify your email." })
}
