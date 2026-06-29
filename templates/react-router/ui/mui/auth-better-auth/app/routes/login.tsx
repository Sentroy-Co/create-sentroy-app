import { useState, type FormEvent } from "react"
import { Link as RouterLink } from "react-router"
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

export function meta() {
  return [{ title: "Sign in" }]
}

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await authClient.signIn.email({ email, password })
    setBusy(false)
    if (error) return setError(error.message ?? "Login failed")
    window.location.href = "/dashboard"
  }

  function signInWithSentroy() {
    void authClient.signIn.oauth2({ providerId: "sentroy", callbackURL: "/dashboard" })
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
          <Divider sx={{ my: 2 }}>or</Divider>
          <Button type="button" variant="outlined" fullWidth onClick={signInWithSentroy}>
            Sign in with Sentroy
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No account?{" "}
            <Link component={RouterLink} to="/signup" underline="hover">
              Create one
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
