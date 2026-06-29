import { authApi, authConfigured } from "@/lib/auth-server.server"
import { commitTokens } from "@/lib/session.server"

interface LoginData {
  user?: unknown
  accessToken?: string
  refreshToken?: string
  mfaRequired?: boolean
  mfaToken?: string
  factorType?: string
}

export async function action({ request }: { request: Request }) {
  if (!authConfigured()) return Response.json({ error: "auth_not_configured" }, { status: 500 })
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string; rememberMe?: boolean }
  if (!body.email || !body.password) return Response.json({ error: "missing_fields" }, { status: 400 })

  const r = await authApi<LoginData>("/login", {
    email: body.email,
    password: body.password,
    rememberMe: Boolean(body.rememberMe),
  })
  if (!r.ok || !r.data) {
    return Response.json({ error: r.error ?? "login_failed", error_description: r.error_description }, { status: r.status || 400 })
  }
  if (r.data.mfaRequired) {
    return Response.json({ mfaRequired: true, mfaToken: r.data.mfaToken, factorType: r.data.factorType })
  }
  const setCookie = await commitTokens(request, { accessToken: r.data.accessToken!, refreshToken: r.data.refreshToken! })
  return Response.json({ user: r.data.user }, { headers: { "Set-Cookie": setCookie } })
}
