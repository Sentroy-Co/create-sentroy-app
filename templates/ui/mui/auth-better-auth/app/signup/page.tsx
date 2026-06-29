"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import NextLink from "next/link"
import { authClient } from "@/lib/auth-client"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await authClient.signUp.email({ email, password, name })
    setBusy(false)
    if (error) return setError(error.message ?? "Sign up failed")
    router.push("/dashboard")
  }

  function signInWithSentroy() {
    void authClient.signIn.oauth2({ providerId: "sentroy", callbackURL: "/dashboard" })
  }

  return (
    <Box sx={{ mx: "auto", maxWidth: 400 }}>
      <Card variant="outlined">
        <CardHeader title="Create account" />
        <CardContent>
          <Stack component="form" onSubmit={onSubmit} spacing={2}>
            <TextField
              id="name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            {error ? <Alert severity="error">{error}</Alert> : null}
            <Button type="submit" variant="contained" disabled={busy}>
              {busy ? "Creating…" : "Create account"}
            </Button>
          </Stack>
          <Divider sx={{ my: 2 }}>or</Divider>
          <Button type="button" variant="outlined" fullWidth onClick={signInWithSentroy}>
            Sign in with Sentroy
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link component={NextLink} href="/login" underline="hover">
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
