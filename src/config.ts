// create-sentroy-app — üretilen projenin bağımlılık + env kompozisyonu.
// À la carte: yalnız seçilen UI + servislerin dep'leri ve env blokları eklenir.

export type UiLib = "shadcn" | "mui"
export type Service = "auth" | "storage" | "email"

export const ALL_SERVICES: Service[] = ["auth", "storage", "email"]

// ── Bağımlılıklar (pinned) ───────────────────────────────────────────────────
export const BASE_DEPS: Record<string, string> = {
  next: "^15.1.6",
  react: "^19.0.0",
  "react-dom": "^19.0.0",
}
export const BASE_DEV_DEPS: Record<string, string> = {
  typescript: "^5.7.3",
  "@types/node": "^22.10.5",
  "@types/react": "^19.0.7",
  "@types/react-dom": "^19.0.3",
}

export const UI_DEPS: Record<UiLib, { deps: Record<string, string>; devDeps: Record<string, string> }> = {
  shadcn: {
    deps: {
      "class-variance-authority": "^0.7.1",
      clsx: "^2.1.1",
      "tailwind-merge": "^2.6.0",
      "lucide-react": "^0.469.0",
    },
    devDeps: {
      tailwindcss: "^4.0.0",
      "@tailwindcss/postcss": "^4.0.0",
      postcss: "^8.4.49",
    },
  },
  mui: {
    deps: {
      "@mui/material": "^6.3.1",
      "@mui/material-nextjs": "^6.3.1",
      "@mui/icons-material": "^6.3.1",
      "@emotion/react": "^11.14.0",
      "@emotion/styled": "^11.14.0",
      "@emotion/cache": "^11.14.0",
    },
    devDeps: {},
  },
}

export const SERVICE_DEPS: Record<Service, { deps: Record<string, string>; devDeps: Record<string, string> }> = {
  auth: { deps: { jose: "^5.9.6" }, devDeps: {} },
  storage: { deps: { "@sentroy-co/client-sdk": "^2.17.0" }, devDeps: {} },
  email: { deps: { "@sentroy-co/client-sdk": "^2.17.0" }, devDeps: {} },
}

// ── .env blokları ─────────────────────────────────────────────────────────────
export function buildEnv(services: Service[]): string {
  const has = (s: Service) => services.includes(s)
  const out: string[] = [
    "# ─────────────────────────────────────────────────────────────",
    "# Sentroy app environment — fill these in.",
    "# NEVER commit real secrets. Server-only keys must stay server-side.",
    "# ─────────────────────────────────────────────────────────────",
    "",
    "NEXT_PUBLIC_APP_URL=http://localhost:3000",
    "",
  ]
  if (has("auth")) {
    out.push(
      "# ── Sentroy Auth (end-user auth) ──",
      "# aps_ key is the MASTER key to your whole user pool — SERVER-ONLY, never ship to the browser.",
      "SENTROY_AUTH_BASE_URL=https://auth.sentroy.com",
      "SENTROY_AUTH_PROJECT_SLUG=your-project-slug",
      "SENTROY_AUTH_API_KEY=aps_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "# Public — used only to verify JWTs against the project JWKS (safe in browser/server).",
      "NEXT_PUBLIC_SENTROY_AUTH_PROJECT_SLUG=your-project-slug",
      "",
    )
  }
  if (has("storage") || has("email")) {
    out.push(
      "# ── Sentroy company access (Storage + Email) ──",
      "# stk_ token is company-scoped admin — SERVER-ONLY.",
      "SENTROY_BASE_URL=https://sentroy.com",
      "SENTROY_COMPANY_SLUG=your-company-slug",
      "SENTROY_ACCESS_TOKEN=stk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "",
    )
  }
  if (has("storage")) {
    out.push("# Default bucket for uploads", "SENTROY_STORAGE_BUCKET=uploads", "")
  }
  if (has("email")) {
    out.push(
      "# ── Email sending ──",
      "SENTROY_EMAIL_FROM=hello@yourdomain.com",
      "SENTROY_EMAIL_DOMAIN_ID=your-domain-id",
      "",
    )
  }
  return out.join("\n")
}

// Dotfile/rename eşlemesi — template'te güvenli adla durur, üretimde gerçek ad.
export const RENAME: Record<string, string> = {
  gitignore: ".gitignore",
}

// Token değişimi yapılacak metin uzantıları.
export const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".css", ".mjs", ".html", "gitignore"])
