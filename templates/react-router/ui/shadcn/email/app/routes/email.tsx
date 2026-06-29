import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function meta() {
  return [{ title: "Email" }]
}

export default function Email() {
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
      r.ok ? { ok: true, text: `Sent! Job: ${j.result?.jobId ?? "queued"}` } : { ok: false, text: j.message || j.error || "Send failed" },
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Email</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Sends a transactional email through a server route using your verified Sentroy sending domain.
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="to">To</Label>
          <Input id="to" type="email" value={to} onChange={(e) => setTo(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-300"
          />
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send email"}
        </Button>
      </form>
      {status ? <p className={status.ok ? "text-sm text-emerald-600" : "text-sm text-red-600"}>{status.text}</p> : null}
    </div>
  )
}
