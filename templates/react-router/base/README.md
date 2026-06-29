# {{PROJECT_NAME}}

Scaffolded with [`create-sentroy-app`](https://github.com/Sentroy-Co/create-sentroy-app) — a **React Router v7 (framework mode)** app on Vite, wired to [Sentroy](https://sentroy.com) Auth, Storage and Email.

## Getting started

```bash
npm install
# fill in .env.local with your Sentroy keys
npm run dev
# → http://localhost:3000
```

## Why React Router v7 (not a plain SPA)?

A pure client-only SPA can't safely talk to Sentroy: your `aps_` (auth) and `stk_`
(storage/email) keys are **master keys** that must never reach the browser. React
Router v7 framework mode gives you a **server** (loaders + actions + resource
routes) on top of Vite — so secrets stay server-side and the session lives in an
**httpOnly cookie**, exactly like the Next.js variant, without being Next.js.

- Resource routes under `app/routes/api.*.ts` proxy to Sentroy with the secret keys.
- `app/lib/session.server.ts` holds the signed, httpOnly cookie session (`createCookieSessionStorage`) and verifies access-token JWTs against the project JWKS with `jose`.
- `*.server.ts` files are guaranteed to never be bundled into the client.

## Scripts

- `npm run dev` — Vite dev server with HMR
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run typecheck` — generate route types + tsc

## Docs

https://docs.sentroy.com/docs/create-app
