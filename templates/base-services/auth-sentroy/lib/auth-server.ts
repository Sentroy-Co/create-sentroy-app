import { cookies } from "next/headers"

// Sentroy Auth Project — SERVER-ONLY. The aps_ key is the master key to your
// entire user pool; it must never reach the browser. These helpers proxy to
// auth.sentroy.com and manage an httpOnly cookie session.

const BASE = process.env.SENTROY_AUTH_BASE_URL ?? "https://auth.sentroy.com"
const SLUG = process.env.SENTROY_AUTH_PROJECT_SLUG ?? ""
const KEY = process.env.SENTROY_AUTH_API_KEY ?? ""

export const AT_COOKIE = "sentroy_at"
export const RT_COOKIE = "sentroy_rt"

export function authConfigured(): boolean {
  return Boolean(SLUG && KEY)
}

interface ApiResult<T> {
  ok: boolean
  status: number
  data?: T
  error?: string
  error_description?: string
}

/** POST to the Auth Project public API. `auth:false` for token-only endpoints. */
export async function authApi<T = unknown>(
  suffix: string,
  body: unknown,
  opts: { auth?: boolean } = {},
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = { "content-type": "application/json" }
  if (opts.auth !== false) headers["authorization"] = `Bearer ${KEY}`
  let res: Response
  try {
    res = await fetch(`${BASE}/api/v1/auth/${SLUG}${suffix}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    })
  } catch {
    return { ok: false, status: 0, error: "network_error" }
  }
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: (json.error as string) ?? "request_failed",
      error_description: json.error_description as string,
    }
  }
  return { ok: true, status: res.status, data: json.data as T }
}

export async function setSessionCookies(tokens: { accessToken: string; refreshToken: string; expiresIn?: number }) {
  const c = await cookies()
  const secure = process.env.NODE_ENV === "production"
  c.set(AT_COOKIE, tokens.accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: tokens.expiresIn ?? 3600,
  })
  c.set(RT_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearSessionCookies() {
  const c = await cookies()
  c.delete(AT_COOKIE)
  c.delete(RT_COOKIE)
}
