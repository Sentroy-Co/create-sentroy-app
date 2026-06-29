import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

// Mounts the full better-auth API at /api/auth/* (sign-up, sign-in, OAuth
// callbacks, session, etc.).
export const { GET, POST } = toNextJsHandler(auth)
