"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import NextLink from "next/link"
import { useSession } from "@/components/session-provider"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"

export default function LoginPage() {
  const router = useRouter()
  const { refresh } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const j = await r.json().catch(() => ({}))
    setBusy(false)
    if (!r.ok) return setError(j.error_description || j.error || "Login failed")
    if (j.mfaRequired) return setError("MFA is required — extend this starter to verify the code.")
    await refresh()
    router.push("/dashboard")
  }

  return (
    <Box sx={{ mx: "auto", maxWidth: 400 }}>
      <Card variant="outlined">
        <CardHeader title="Sign in" />
        <CardContent>
          <Stack component="form" onSubmit={onSubmit} spacing={2}>
            <TextField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            {error ? <Alert severity="error">{error}</Alert> : null}
            <Button type="submit" variant="contained" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </Stack>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Link component={NextLink} href="/signup" variant="body2" underline="hover">
              Create account
            </Link>
            <Link component={NextLink} href="/forgot-password" variant="body2" underline="hover">
              Forgot password?
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
