import { authApi, authConfigured } from "@/lib/auth-server.server"

export async function action({ request }: { request: Request }) {
  if (!authConfigured()) return Response.json({ error: "auth_not_configured" }, { status: 500 })
  const body = (await request.json().catch(() => ({}))) as { email?: string }
  if (!body.email) return Response.json({ error: "missing_fields" }, { status: 400 })
  await authApi("/password-reset/request", { email: body.email })
  return Response.json({ ok: true })
}
