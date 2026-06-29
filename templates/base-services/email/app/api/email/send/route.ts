import { NextResponse } from "next/server"
import { sentroy, sentroyConfigured } from "@/lib/sentroy-server"

export const runtime = "nodejs"

// Sends a transactional email via Sentroy (stk_ token stays server-side).
export async function POST(req: Request) {
  if (!sentroyConfigured()) return NextResponse.json({ error: "email_not_configured" }, { status: 500 })
  const from = process.env.SENTROY_EMAIL_FROM
  const domainId = process.env.SENTROY_EMAIL_DOMAIN_ID
  if (!from || !domainId) return NextResponse.json({ error: "email_not_configured" }, { status: 500 })

  const body = (await req.json().catch(() => ({}))) as { to?: string; subject?: string; html?: string; text?: string }
  if (!body.to || !body.subject || (!body.html && !body.text)) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }

  try {
    const result = await sentroy().send.email({
      to: body.to,
      from,
      subject: body.subject,
      domainId,
      html: body.html,
      text: body.text,
    })
    return NextResponse.json({ result })
  } catch (e) {
    return NextResponse.json(
      { error: "send_failed", message: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    )
  }
}
