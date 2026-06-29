import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { authApi, clearSessionCookies, RT_COOKIE } from "@/lib/auth-server"

export async function POST() {
  const rt = (await cookies()).get(RT_COOKIE)?.value
  if (rt) await authApi("/logout", { refreshToken: rt }) // best-effort
  await clearSessionCookies()
  return NextResponse.json({ ok: true })
}
