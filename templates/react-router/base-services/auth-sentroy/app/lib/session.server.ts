import { createCookieSessionStorage } from "react-router"
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose"
import { authApi } from "@/lib/auth-server.server"

// httpOnly, signed session cookie holding the Sentroy access + refresh tokens.
// SERVER-ONLY. The browser never sees the raw tokens or the aps_ key.

const BASE = process.env.SENTROY_AUTH_BASE_URL ?? "https://auth.sentroy.com"
const SLUG = process.env.SENTROY_AUTH_PROJECT_SLUG ?? process.env.NEXT_PUBLIC_SENTROY_AUTH_PROJECT_SLUG ?? ""

const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    secrets: [process.env.SESSION_SECRET ?? "dev-secret-change-me"],
    maxAge: 60 * 60 * 24 * 30,
  },
})

export interface SessionUser {
  id: string
  email: string
  emailVerified: boolean
  name: string | null
  picture: string | null
}

let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null
function jwks() {
  if (!_jwks) _jwks = createRemoteJWKSet(new URL(`${BASE}/api/v1/auth/${SLUG}/jwks.json`))
  return _jwks
}

function toUser(p: JWTPayload): SessionUser {
  const r = p as Record<string, unknown>
  return {
    id: String(p.sub ?? ""),
    email: String(r.email ?? ""),
    emailVerified: Boolean(r.email_verified),
    name: (r.name as string | null) ?? null,
    picture: (r.picture as string | null) ?? null,
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

/** Set tokens into a fresh session, return the Set-Cookie value. */
export async function commitTokens(request: Request, tokens: { accessToken: string; refreshToken: string }): Promise<string> {
  const session = await storage.getSession(request.headers.get("Cookie"))
  session.set("accessToken", tokens.accessToken)
  session.set("refreshToken", tokens.refreshToken)
  return storage.commitSession(session)
}

export async function clearSession(request: Request): Promise<string> {
  const session = await storage.getSession(request.headers.get("Cookie"))
  return storage.destroySession(session)
}

export async function getRefreshToken(request: Request): Promise<string | null> {
  const session = await storage.getSession(request.headers.get("Cookie"))
  return (session.get("refreshToken") as string | undefined) ?? null
}

/** Verify the access-token cookie only (no refresh). */
export async function getSessionUser(request: Request): Promise<SessionUser | null> {
  const session = await storage.getSession(request.headers.get("Cookie"))
  const at = session.get("accessToken") as string | undefined
  return at ? verifyAccessToken(at) : null
}

/** Verify; if expired, transparently refresh and return a Set-Cookie to rotate. */
export async function resolveSession(request: Request): Promise<{ user: SessionUser | null; setCookie?: string }> {
  const session = await storage.getSession(request.headers.get("Cookie"))
  const at = session.get("accessToken") as string | undefined
  if (at) {
    const u = await verifyAccessToken(at)
    if (u) return { user: u }
  }
  const rt = session.get("refreshToken") as string | undefined
  if (!rt) return { user: null }
  const r = await authApi<{ accessToken: string; refreshToken: string }>("/refresh", { refreshToken: rt })
  if (!r.ok || !r.data) return { user: null }
  session.set("accessToken", r.data.accessToken)
  session.set("refreshToken", r.data.refreshToken)
  const user = await verifyAccessToken(r.data.accessToken)
  return { user, setCookie: await storage.commitSession(session) }
}
