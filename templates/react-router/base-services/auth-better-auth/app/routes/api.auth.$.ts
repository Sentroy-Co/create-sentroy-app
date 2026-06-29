import { auth } from "@/lib/auth.server"

// Mounts the full better-auth API at /api/auth/* (sign-up, sign-in, OAuth
// callbacks, session…). auth.handler returns a standard Response.
export async function loader({ request }: { request: Request }) {
  return auth.handler(request)
}

export async function action({ request }: { request: Request }) {
  return auth.handler(request)
}
