import { resolveSession } from "@/lib/session.server"

// "Who am I" — verifies the access token, refreshing + rotating the cookie when
// expired. Returns { user: null } (200) when signed out.
export async function loader({ request }: { request: Request }) {
  const { user, setCookie } = await resolveSession(request)
  return Response.json({ user: user ?? null }, setCookie ? { headers: { "Set-Cookie": setCookie } } : undefined)
}
