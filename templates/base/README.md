# {{PROJECT_NAME}}

Scaffolded with [`create-sentroy-app`](https://github.com/Sentroy-Co/create-sentroy-app) — a Next.js starter wired to [Sentroy](https://sentroy.com) Auth, Storage and Email.

## Getting started

1. Fill in `.env.local` with your Sentroy keys (see comments in the file).
2. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Open http://localhost:3000

## Security model

This starter keeps **all secret keys server-side**:

- **Auth** — your `aps_` Auth Project key is the master key to your whole user pool. It is used **only** in server route handlers (`app/api/auth/*`), which proxy to `auth.sentroy.com` and set an **httpOnly cookie** session. The browser never sees the key or the raw tokens.
- **Storage / Email** — your `stk_` company access token is used only in server routes (`app/api/storage/*`, `app/api/email/*`).

Never move these keys into `NEXT_PUBLIC_*` variables or client components.

## What's included

Depending on the services you selected at scaffold time:

- `app/api/auth/*` + `app/(auth)` pages + `lib/session.ts` — end-user auth (signup, login, logout, session, password reset).
- `app/api/storage/*` + storage page — file upload/list through your buckets.
- `app/api/email/send` + email page — transactional email send.

`lib/features.ts` records which services are enabled and drives the nav.

## Docs

https://docs.sentroy.com
