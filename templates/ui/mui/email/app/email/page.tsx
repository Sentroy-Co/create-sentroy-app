"use client"

import { useState, type FormEvent } from "react"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"

export default function EmailPage() {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    const r = await fetch("/api/email/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ to, subject, text: message, html: `<p>${message}</p>` }),
    })
    const j = await r.json().catch(() => ({}))
    setBusy(false)
    setStatus(
      r.ok
        ? { ok: true, text: `Sent! Job: ${j.result?.jobId ?? "queued"}` }
        : { ok: false, text: j.message || j.error || "Send failed" },
    )
  }

  return (
    <Box sx={{ mx: "auto", maxWidth: 480 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            Email
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sends a transactional email through a server route using your verified Sentroy sending domain.
          </Typography>
        </Box>
        <Stack component="form" onSubmit={onSubmit} spacing={2}>
          <TextField
            id="to"
            label="To"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            fullWidth
          />
          <TextField
            id="subject"
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            fullWidth
          />
          <TextField
            id="message"
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            multiline
            rows={5}
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={busy}>
            {busy ? "Sending…" : "Send email"}
          </Button>
        </Stack>
        {status ? <Alert severity={status.ok ? "success" : "error"}>{status.text}</Alert> : null}
      </Stack>
    </Box>
  )
}
