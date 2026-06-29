import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { buildDeps, buildEnv, RENAME, TEXT_EXT, type AuthProvider, type Framework, type Service, type UiLib } from "./config.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES = path.join(__dirname, "..", "templates")

export interface GenerateOptions {
  dir: string
  projectName: string
  framework: Framework
  ui: UiLib
  services: Service[]
  /** Auth engine when `auth` is in services. */
  authProvider: AuthProvider
}

function copyDir(src: string, dest: string, projectName: string) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name)
    const name = RENAME[entry.name] ?? entry.name
    const to = path.join(dest, name)
    if (entry.isDirectory()) copyDir(from, to, projectName)
    else copyFile(from, to, projectName, entry.name)
  }
}

function copyFile(from: string, to: string, projectName: string, origName: string) {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  const ext = path.extname(origName)
  if (TEXT_EXT.has(ext) || TEXT_EXT.has(origName)) {
    fs.writeFileSync(to, fs.readFileSync(from, "utf8").replaceAll("{{PROJECT_NAME}}", projectName))
  } else {
    fs.copyFileSync(from, to)
  }
}

export function generate(opts: GenerateOptions) {
  const { dir, projectName, framework, ui, services, authProvider } = opts
  const has = (s: Service) => services.includes(s)
  // auth → auth-<provider> tree; storage/email → their own.
  const svcDir = (s: Service) => (s === "auth" ? `auth-${authProvider}` : s)
  // next templates live at templates/{base,base-services,ui}; RR under templates/react-router/*
  const root = framework === "next" ? TEMPLATES : path.join(TEMPLATES, "react-router")
  const fw = (sub: string) => path.join(root, sub)
  fs.mkdirSync(dir, { recursive: true })

  // 1) Base + UI common shell
  copyDir(fw("base"), dir, projectName)
  copyDir(fw(`ui/${ui}/common`), dir, projectName)

  // 2) Per-service trees (server + UI)
  if (has("storage") || has("email")) copyDir(fw("base-services/company"), dir, projectName)
  for (const s of services) {
    copyDir(fw(`base-services/${svcDir(s)}`), dir, projectName)
    copyDir(fw(`ui/${ui}/${svcDir(s)}`), dir, projectName)
  }

  // 3) Providers — Next picks providers.tsx. The Sentroy auth provider needs a
  //    client SessionProvider; better-auth uses a standalone authClient (no
  //    provider), so it falls back to base. React Router handles providers in
  //    root.tsx, so skip there.
  if (framework === "next") {
    const needsSessionProvider = has("auth") && authProvider === "sentroy"
    const providerSrc = fw(`ui/${ui}/_providers/${needsSessionProvider ? "auth.tsx" : "base.tsx"}`)
    copyFile(providerSrc, path.join(dir, "app", "providers.tsx"), projectName, "auth.tsx")
  }

  // 4) Generated feature flags (drives conditional nav — safe, no imports)
  const featuresBody = `// create-sentroy-app — etkin servisler (nav koşulları bunu okur).
export const features = {
  auth: ${has("auth")},
  storage: ${has("storage")},
  email: ${has("email")},
} as const
`
  const featuresPath = framework === "next" ? path.join(dir, "lib", "features.ts") : path.join(dir, "app", "lib", "features.ts")
  fs.mkdirSync(path.dirname(featuresPath), { recursive: true })
  fs.writeFileSync(featuresPath, featuresBody)

  // 5) package.json
  const { dependencies, devDependencies } = buildDeps(framework, ui, services, authProvider)
  const scripts =
    framework === "next"
      ? { dev: "next dev", build: "next build", start: "next start" }
      : { dev: "react-router dev", build: "react-router build", start: "react-router-serve ./build/server/index.js", typecheck: "react-router typegen && tsc" }
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({ name: projectName, version: "0.1.0", private: true, type: framework === "react-router" ? "module" : undefined, scripts, dependencies, devDependencies }, null, 2) + "\n",
  )

  // 6) .env
  const env = buildEnv(framework, services, authProvider)
  fs.writeFileSync(path.join(dir, ".env.example"), env)
  fs.writeFileSync(path.join(dir, ".env.local"), env)
}
