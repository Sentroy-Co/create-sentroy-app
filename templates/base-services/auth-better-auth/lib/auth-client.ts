"use client"

import { createAuthClient } from "better-auth/react"
import { genericOAuthClient } from "better-auth/client/plugins"

// Defaults baseURL to the current origin (same-origin app), so this works
// unchanged on Next.js and React Router.
export const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient
