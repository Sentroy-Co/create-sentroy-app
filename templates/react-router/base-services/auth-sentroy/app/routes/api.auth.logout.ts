import { authApi } from "@/lib/auth-server.server"
import { clearSession, getRefreshToken } from "@/lib/session.server"

export async function action({ request }: { request: Request }) {
  const rt = await getRefreshToken(request)
  if (rt) await authApi("/logout", { refreshToken: rt }) // best-effort
  const setCookie = await clearSession(request)
  return Response.json({ ok: true }, { headers: { "Set-Cookie": setCookie } })
}
