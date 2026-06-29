// Sentroy Auth Project proxy — SERVER-ONLY (.server.ts is never bundled to the
// client). The aps_ key is the master key to your whole user pool.

const BASE = process.env.SENTROY_AUTH_BASE_URL ?? "https://auth.sentroy.com"
const SLUG = process.env.SENTROY_AUTH_PROJECT_SLUG ?? ""
const KEY = process.env.SENTROY_AUTH_API_KEY ?? ""

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
