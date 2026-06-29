// create-sentroy-app — üretilen projenin bağımlılık + env kompozisyonu.
// À la carte: yalnız seçilen framework + UI + servislerin dep'leri / env'i eklenir.

export type Framework = "next" | "react-router"
export type UiLib = "shadcn" | "mui"
export type Service = "auth" | "storage" | "email"

export const ALL_SERVICES: Service[] = ["auth", "storage", "email"]

// ── Framework çekirdek bağımlılıkları ─────────────────────────────────────────
const FRAMEWORK_DEPS: Record<Framework, { deps: Record<string, string>; devDeps: Record<string, string> }> = {
  next: {
    deps: { next: "^15.1.6", react: "^19.0.0", "react-dom": "^19.0.0" },
    devDeps: {
      typescript: "^5.7.3",
      "@types/node": "^22.10.5",
      "@types/react": "^19.0.7",
      "@types/react-dom": "^19.0.3",
    },
  },
  "react-router": {
    deps: {
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      "react-router": "^7.1.5",
      "@react-router/node": "^7.1.5",
      "@react-router/serve": "^7.1.5",
      "@react-router/fs-routes": "^7.1.5",
      isbot: "^5.1.0",
    },
    devDeps: {
      "@react-router/dev": "^7.1.5",
      vite: "^6.0.0",
      "vite-tsconfig-paths": "^5.1.4",
      typescript: "^5.7.3",
      "@types/node": "^22.10.5",
      "@types/react": "^19.0.7",
      "@types/react-dom": "^19.0.3",
    },
  },
}

// ── UI bağımlılıkları (framework'e göre Tailwind/MUI SSR farkları) ─────────────
const UI_DEPS: Record<Framework, Record<UiLib, { deps: Record<string, string>; devDeps: Record<string, string> }>> = {
  next: {
    shadcn: {
      deps: { "class-variance-authority": "^0.7.1", clsx: "^2.1.1", "tailwind-merge": "^2.6.0", "lucide-react": "^0.469.0" },
      devDeps: { tailwindcss: "^4.0.0", "@tailwindcss/postcss": "^4.0.0", postcss: "^8.4.49" },
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
  },
  "react-router": {
    shadcn: {
      deps: { "class-variance-authority": "^0.7.1", clsx: "^2.1.1", "tailwind-merge": "^2.6.0", "lucide-react": "^0.469.0" },
      devDeps: { tailwindcss: "^4.0.0", "@tailwindcss/vite": "^4.0.0" },
    },
    mui: {
      deps: {
        "@mui/material": "^6.3.1",
        "@mui/icons-material": "^6.3.1",
        "@emotion/react": "^11.14.0",
        "@emotion/styled": "^11.14.0",
        "@emotion/cache": "^11.14.0",
        "@emotion/server": "^11.11.0",
      },
      devDeps: {},
    },
  },
}

// Servis bağımlılıkları (framework-agnostik).
const SERVICE_DEPS: Record<Service, { deps: Record<string, string>; devDeps: Record<string, string> }> = {
  auth: { deps: { jose: "^5.9.6" }, devDeps: {} },
  storage: { deps: { "@sentroy-co/client-sdk": "^2.17.0" }, devDeps: {} },
  email: { deps: { "@sentroy-co/client-sdk": "^2.17.0" }, devDeps: {} },
}

function merge(...maps: Record<string, string>[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of maps) for (const [k, v] of Object.entries(m)) out[k] = v
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)))
}

export function buildDeps(framework: Framework, ui: UiLib, services: Service[]) {
  return {
    dependencies: merge(
      FRAMEWORK_DEPS[framework].deps,
      UI_DEPS[framework][ui].deps,
      ...services.map((s) => SERVICE_DEPS[s].deps),
    ),
    devDependencies: merge(
      FRAMEWORK_DEPS[framework].devDeps,
      UI_DEPS[framework][ui].devDeps,
      ...services.map((s) => SERVICE_DEPS[s].devDeps),
    ),
  }
}

// ── .env blokları (framework-agnostik — aynı server proxy güvenlik modeli) ─────
export function buildEnv(framework: Framework, services: Service[]): string {
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
    )
    if (framework === "react-router") {
      out.push("# Signs the httpOnly session cookie (use a long random string).", "SESSION_SECRET=change-me-to-a-long-random-string")
    }
    out.push("")
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
  if (has("storage")) out.push("# Default bucket for uploads", "SENTROY_STORAGE_BUCKET=uploads", "")
  if (has("email")) out.push("# ── Email sending ──", "SENTROY_EMAIL_FROM=hello@yourdomain.com", "SENTROY_EMAIL_DOMAIN_ID=your-domain-id", "")
  return out.join("\n")
}

// Dotfile/rename eşlemesi — template'te güvenli adla durur, üretimde gerçek ad.
export const RENAME: Record<string, string> = {
  gitignore: ".gitignore",
}

// Token değişimi yapılacak metin uzantıları.
export const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".css", ".mjs", ".html", "gitignore"])
