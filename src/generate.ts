import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  BASE_DEPS,
  BASE_DEV_DEPS,
  UI_DEPS,
  SERVICE_DEPS,
  buildEnv,
  RENAME,
  TEXT_EXT,
  type Service,
  type UiLib,
} from "./config.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES = path.join(__dirname, "..", "templates")

export interface GenerateOptions {
  dir: string // absolute target dir
  projectName: string
  ui: UiLib
  services: Service[]
}

function copyDir(src: string, dest: string, projectName: string) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name)
    const name = RENAME[entry.name] ?? entry.name
    const to = path.join(dest, name)
    if (entry.isDirectory()) {
      copyDir(from, to, projectName)
    } else {
      copyFile(from, to, projectName, entry.name)
    }
  }
}

function copyFile(from: string, to: string, projectName: string, origName: string) {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  const ext = path.extname(origName)
  const isText = TEXT_EXT.has(ext) || TEXT_EXT.has(origName)
  if (isText) {
    const content = fs.readFileSync(from, "utf8").replaceAll("{{PROJECT_NAME}}", projectName)
    fs.writeFileSync(to, content)
  } else {
    fs.copyFileSync(from, to)
  }
}

function mergeDeps(...maps: Record<string, string>[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of maps) for (const [k, v] of Object.entries(m)) out[k] = v
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)))
}

export function generate(opts: GenerateOptions) {
  const { dir, projectName, ui, services } = opts
  const has = (s: Service) => services.includes(s)
  fs.mkdirSync(dir, { recursive: true })

  // 1) Base (UI-agnostic config) + UI common shell
  copyDir(path.join(TEMPLATES, "base"), dir, projectName)
  copyDir(path.join(TEMPLATES, "ui", ui, "common"), dir, projectName)

  // 2) Per-service trees (server + UI)
  if (has("storage") || has("email")) copyDir(path.join(TEMPLATES, "base-services", "company"), dir, projectName)
  for (const s of services) {
    copyDir(path.join(TEMPLATES, "base-services", s), dir, projectName)
    copyDir(path.join(TEMPLATES, "ui", ui, s), dir, projectName)
  }

  // 3) Providers (auth-aware) → app/providers.tsx
  const providerSrc = path.join(TEMPLATES, "ui", ui, "_providers", has("auth") ? "auth.tsx" : "base.tsx")
  copyFile(providerSrc, path.join(dir, "app", "providers.tsx"), projectName, "auth.tsx")

  // 4) Generated feature flags (drives conditional nav — safe, no imports)
  const features = `// create-sentroy-app — etkin servisler (nav koşulları bunu okur).
export const features = {
  auth: ${has("auth")},
  storage: ${has("storage")},
  email: ${has("email")},
} as const
`
  fs.mkdirSync(path.join(dir, "lib"), { recursive: true })
  fs.writeFileSync(path.join(dir, "lib", "features.ts"), features)

  // 5) package.json (assembled)
  const pkg = {
    name: projectName,
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
    },
    dependencies: mergeDeps(BASE_DEPS, UI_DEPS[ui].deps, ...services.map((s) => SERVICE_DEPS[s].deps)),
    devDependencies: mergeDeps(BASE_DEV_DEPS, UI_DEPS[ui].devDeps, ...services.map((s) => SERVICE_DEPS[s].devDeps)),
  }
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg, null, 2) + "\n")

  // 6) .env files
  const env = buildEnv(services)
  fs.writeFileSync(path.join(dir, ".env.example"), env)
  fs.writeFileSync(path.join(dir, ".env.local"), env)
}
