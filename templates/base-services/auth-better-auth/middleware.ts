import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

// Fast gate for protected routes — checks the better-auth session cookie's
// presence (no DB hit). The /dashboard page additionally verifies the session
// server-side.
export function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req)
  if (!sessionCookie) {
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
