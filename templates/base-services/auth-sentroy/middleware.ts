import { NextResponse, type NextRequest } from "next/server"

// Coarse gate for protected routes: checks session-cookie presence and redirects
// to /login if absent. Real JWT verification happens server-side on the page
// (see lib/session.ts getSession). This keeps middleware fast (no JWKS fetch).

const AT_COOKIE = "sentroy_at"
const RT_COOKIE = "sentroy_rt"

export function middleware(req: NextRequest) {
  const hasSession = req.cookies.has(AT_COOKIE) || req.cookies.has(RT_COOKIE)
  if (!hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
