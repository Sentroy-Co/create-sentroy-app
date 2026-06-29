import { useState, type FormEvent } from "react"
import { Link as RouterLink } from "react-router"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

export function meta() {
  return [{ title: "Reset password" }]
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    await fetch("/api/auth/password-reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setBusy(false)
    setSent(true)
  }

  return (
    <Box sx={{ mx: "auto", maxWidth: 400 }}>
      <Card variant="outlined">
        <CardHeader title="Reset password" />
        <CardContent>
          {sent ? (
            <Typography variant="body2" color="text.secondary">
              If an account exists for <Box component="span" sx={{ fontWeight: 500 }}>{email}</Box>, a reset link is on its way.
            </Typography>
          ) : (
            <Stack component="form" onSubmit={onSubmit} spacing={2}>
              <TextField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" disabled={busy}>
                {busy ? "Sending…" : "Send reset link"}
              </Button>
            </Stack>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            <Link component={RouterLink} to="/login" underline="hover">
              Back to sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
