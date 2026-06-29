#!/usr/bin/env node
import path from "node:path"
import fs from "node:fs"
import { spawnSync } from "node:child_process"
import * as p from "@clack/prompts"
import pc from "picocolors"
import { generate } from "./generate.js"
import { ALL_SERVICES, type Framework, type Service, type UiLib } from "./config.js"

function detectPm(): "npm" | "pnpm" | "yarn" | "bun" {
  const ua = process.env.npm_config_user_agent ?? ""
  if (ua.startsWith("pnpm")) return "pnpm"
  if (ua.startsWith("yarn")) return "yarn"
  if (ua.startsWith("bun")) return "bun"
  return "npm"
}

async function main() {
  console.log("")
  p.intro(pc.bgCyan(pc.black(" create-sentroy-app ")))

  const argName = process.argv[2] && !process.argv[2].startsWith("-") ? process.argv[2] : undefined

  const projectName = (await p.text({
    message: "Project name?",
    placeholder: "my-sentroy-app",
    initialValue: argName,
    defaultValue: "my-sentroy-app",
    validate(value) {
      const v = (value || "my-sentroy-app").trim()
      if (!/^[a-z0-9._-]+$/i.test(v)) return "Use letters, numbers, dashes, dots or underscores."
      const dir = path.resolve(process.cwd(), v)
      if (fs.existsSync(dir) && fs.readdirSync(dir).length > 0) return `Directory "${v}" already exists and is not empty.`
      return undefined
    },
  })) as string
  if (p.isCancel(projectName)) return p.cancel("Cancelled.")

  const framework = (await p.select({
    message: "Framework?",
    options: [
      { value: "next", label: "Next.js", hint: "App Router, server routes + httpOnly cookies" },
      { value: "react-router", label: "React Router v7", hint: "Vite + SSR (framework mode), loaders/actions" },
    ],
    initialValue: "next" as Framework,
  })) as Framework
  if (p.isCancel(framework)) return p.cancel("Cancelled.")

  const ui = (await p.select({
    message: "UI library?",
    options: [
      { value: "shadcn", label: "shadcn/ui", hint: "Tailwind v4 + headless primitives" },
      { value: "mui", label: "Material UI", hint: "@mui/material + Emotion" },
    ],
    initialValue: "shadcn" as UiLib,
  })) as UiLib
  if (p.isCancel(ui)) return p.cancel("Cancelled.")

  const services = (await p.multiselect({
    message: "Which Sentroy services?",
    options: [
      { value: "auth", label: "Auth", hint: "end-user signup/login (httpOnly cookie session)" },
      { value: "storage", label: "Storage", hint: "file uploads via server route" },
      { value: "email", label: "Email", hint: "transactional send via server route" },
    ],
    initialValues: ALL_SERVICES,
    required: false,
  })) as Service[]
  if (p.isCancel(services)) return p.cancel("Cancelled.")

  type PmChoice = "skip" | "npm" | "pnpm" | "yarn" | "bun"
  const defaultPm = detectPm()
  const pm = (await p.select({
    message: "Install dependencies with?",
    options: [
      { value: "skip", label: "Skip — I'll install later" },
      { value: "npm", label: "npm" },
      { value: "pnpm", label: "pnpm" },
      { value: "yarn", label: "yarn" },
      { value: "bun", label: "bun" },
    ],
    initialValue: defaultPm as PmChoice,
  })) as string
  if (p.isCancel(pm)) return p.cancel("Cancelled.")

  const doGit = (await p.confirm({ message: "Initialize a git repository?", initialValue: true })) as boolean
  if (p.isCancel(doGit)) return p.cancel("Cancelled.")

  const dir = path.resolve(process.cwd(), projectName)

  const s = p.spinner()
  s.start("Scaffolding project")
  try {
    generate({ dir, projectName, framework, ui, services })
  } catch (err) {
    s.stop("Scaffolding failed")
    p.log.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }
  s.stop("Project scaffolded")

  if (doGit) {
    const git = (cmd: string[]) => spawnSync("git", cmd, { cwd: dir, stdio: "ignore" })
    if (git(["init"]).status === 0) {
      git(["add", "-A"])
      git(["commit", "-m", "Initial commit from create-sentroy-app"])
      p.log.success("git repository initialized")
    }
  }

  if (pm !== "skip") {
    const sp = p.spinner()
    sp.start(`Installing dependencies with ${pm}`)
    const res = spawnSync(pm, ["install"], { cwd: dir, stdio: "ignore" })
    if (res.status === 0) sp.stop("Dependencies installed")
    else sp.stop(pc.yellow(`Could not install automatically — run \`${pm} install\` yourself.`))
  }

  const runDev = pm === "skip" ? "npm run dev" : pm === "npm" ? "npm run dev" : `${pm} dev`
  const steps = [
    `${pc.cyan("cd")} ${projectName}`,
    pm === "skip" ? `${pc.cyan(defaultPm + " install")}` : null,
    `Fill in ${pc.cyan(".env.local")} with your Sentroy keys`,
    `${pc.cyan(runDev)}`,
  ].filter(Boolean)

  p.note(steps.join("\n"), "Next steps")
  p.outro(
    `${pc.green("Done!")} ${framework}/${ui}${services.length ? ` · ${services.join(", ")}` : " · bare"}\n` +
      `Docs: ${pc.underline("https://docs.sentroy.com")}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
