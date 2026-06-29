# create-sentroy-app

Scaffold a **Next.js** or **React Router v7** app pre-wired to [Sentroy](https://sentroy.com) — **Auth**, **Storage** and **Email** — with your choice of **shadcn/ui** or **Material UI**.

```bash
npm create sentroy-app@latest
# or
pnpm create sentroy-app
# or
bun create sentroy-app
```

The CLI asks for:

- **Project name**
- **Framework** — Next.js (App Router) or React Router v7 (Vite + SSR, framework mode)
- **UI library** — shadcn/ui (Tailwind v4) or Material UI (MUI v6)
- **Services** (à la carte) — Auth, Storage, Email (any subset)
- **Auth provider** (when Auth is selected) — Sentroy Auth Project (hosted, no DB) or better-auth (self-hosted SQLite) + Sign in with Sentroy
- **Package manager** + git init

Both frameworks keep secrets server-side: Next.js uses route handlers + httpOnly
cookies; React Router uses loaders/actions + resource routes with a signed cookie
session. A pure client-only SPA isn't offered because it can't hold the master
keys safely.

…then generates a ready-to-run app with only the pieces you picked.

## What you get

| Service | What's wired |
|---|---|
| **Auth** | Signup / login / logout + a protected `/dashboard`. Two providers: **Sentroy Auth Project** (hosted user pool, no DB — server routes proxy to `auth.sentroy.com` + httpOnly cookie, JWTs verified via JWKS), or **better-auth** (self-hosted users in SQLite) with **Sign in with Sentroy** (OAuth/OIDC). With better-auth, run `npx @better-auth/cli@latest migrate` once after install to create the tables. |
| **Storage** | `/storage` page with file upload + listing through your Sentroy buckets, via a server route. |
| **Email** | `/email` page that sends transactional email through a server route using your verified domain. |

## Security model

Every secret key stays **server-side**:

- The Auth Project `aps_` key (master key to your user pool) lives only in `app/api/auth/*` route handlers.
- The company `stk_` access token (Storage + Email) lives only in `app/api/storage/*` and `app/api/email/send`.

Nothing secret is ever shipped to the browser — the client only talks to your own Next.js routes, which set httpOnly cookies and proxy to Sentroy.

## After scaffolding

```bash
cd my-app
npm install            # if you skipped install
# fill in .env.local with your Sentroy keys (see the comments in the file)
npm run dev
```

Get your keys from the Sentroy dashboard:

- **Auth** — create an Auth Project (auth.sentroy.com) → copy its slug + `aps_` API key.
- **Storage / Email** — create a company access token (`stk_`) with the relevant permissions; for email, verify a sending domain and note its domain id.

## shadcn components & presets

The shadcn variant ships a `components.json` (Next.js and React Router), so it's a
standard shadcn project — add components/blocks and apply theme presets directly:

```bash
npx shadcn@latest add button card dialog
npx shadcn@latest apply <preset>
```

`shadcn init --template next|react-router --preset <id>` is shadcn's own project
creator (UI only, no Sentroy wiring) — use `create-sentroy-app` for the full
starter and layer shadcn on top. See https://docs.sentroy.com/docs/create-app#shadcn

## Development (this package)

```bash
bun install
bun run build        # tsc → dist
bun run dev          # run the CLI from source (tsx)
```

Templates live under `templates/`:

- `base/` — UI-agnostic config (Next config, tsconfig, gitignore, README).
- `base-services/{auth,company,storage,email}/` — server routes + libs per service.
- `ui/{shadcn,mui}/{common,auth,storage,email}/` — UI per variant + service.
- `_providers/{base,auth}.tsx` per UI — chosen based on whether Auth is selected.

The generator (`src/generate.ts`) composes the project from the selected UI + services, writes `lib/features.ts`, and assembles `package.json` + `.env`.

## License

MIT
