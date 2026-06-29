import Database from "better-sqlite3"
import { betterAuth } from "better-auth"
import { genericOAuth } from "better-auth/plugins"

// better-auth server — self-hosted users in SQLite. SERVER-ONLY.
// After install, create the tables once:  npx @better-auth/cli@latest migrate
//
// "Sign in with Sentroy" is wired as a generic OAuth/OIDC provider; it only
// activates when the SENTROY_OAUTH_* env vars are set.

const sentroyConfigured = Boolean(process.env.SENTROY_OAUTH_CLIENT_ID && process.env.SENTROY_OAUTH_CLIENT_SECRET)

export const auth = betterAuth({
  database: new Database(process.env.DATABASE_URL ?? "./sqlite.db"),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
  plugins: sentroyConfigured
    ? [
        genericOAuth({
          config: [
            {
              providerId: "sentroy",
              clientId: process.env.SENTROY_OAUTH_CLIENT_ID as string,
              clientSecret: process.env.SENTROY_OAUTH_CLIENT_SECRET as string,
              discoveryUrl:
                process.env.SENTROY_OAUTH_DISCOVERY_URL ?? "https://auth.sentroy.com/.well-known/openid-configuration",
              scopes: ["openid", "email", "profile"],
            },
          ],
        }),
      ]
    : [],
})
