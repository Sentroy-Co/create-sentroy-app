import { cookies } from "next/headers"
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose"
import { AT_COOKIE, RT_COOKIE, authApi, setSessionCookies } from "@/lib/auth-server"

// Verifies Sentroy Auth access tokens (RS256) against the project's public JWKS.
const BASE = process.env.SENTROY_AUTH_BASE_URL ?? "https://auth.sentroy.com"
const SLUG = process.env.SENTROY_AUTH_PROJECT_SLUG ?? process.env.NEXT_PUBLIC_SENTROY_AUTH_PROJECT_SLUG ?? ""

let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null
function jwks() {
  if (!_jwks) _jwks = createRemoteJWKSet(new URL(`${BASE}/api/v1/auth/${SLUG}/jwks.json`))
  return _jwks
}

export interface SessionUser {
  id: string
  email: string
  emailVerified: boolean
  name: string | null
  picture: string | null
}

function toUser(p: JWTPayload): SessionUser {
  return {
    id: String(p.sub ?? ""),
    email: String(p.email ?? ""),
    emailVerified: Boolean((p as Record<string, unknown>).email_verified),
    name: ((p as Record<string, unknown>).name as string | null) ?? null,
    picture: ((p as Record<string, unknown>).picture as string | null) ?? null,
  }
}

export async function verifyAccessToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, jwks(), { issuer: `${BASE}/p/${SLUG}` })
    return toUser(payload)
  } catch {
    return null
  }
}

/** Server components / pages: verify the access-token cookie (no refresh). */
export async function getSession(): Promise<SessionUser | null> {
  const at = (await cookies()).get(AT_COOKIE)?.value
  return at ? verifyAccessToken(at) : null
}

/** Route handlers: verify access token, else refresh via the refresh-token cookie. */
export async function getSessionWithRefresh(): Promise<SessionUser | null> {
  const c = await cookies()
  const at = c.get(AT_COOKIE)?.value
  if (at) {
    const u = await verifyAccessToken(at)
    if (u) return u
  }
  const rt = c.get(RT_COOKIE)?.value
  if (!rt) return null
  const r = await authApi<{ accessToken: string; refreshToken: string; expiresIn: number }>("/refresh", {
    refreshToken: rt,
  })
  if (!r.ok || !r.data) return null
  await setSessionCookies(r.data)
  return verifyAccessToken(r.data.accessToken)
}
