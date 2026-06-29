import { createAuthClient } from "better-auth/react"
import { genericOAuthClient } from "better-auth/client/plugins"

// Defaults baseURL to the current origin (same-origin app).
export const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient
