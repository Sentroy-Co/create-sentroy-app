import { sentroy, sentroyConfigured } from "@/lib/sentroy-server.server"

export async function action({ request }: { request: Request }) {
  if (!sentroyConfigured()) return Response.json({ error: "email_not_configured" }, { status: 500 })
  const from = process.env.SENTROY_EMAIL_FROM
  const domainId = process.env.SENTROY_EMAIL_DOMAIN_ID
  if (!from || !domainId) return Response.json({ error: "email_not_configured" }, { status: 500 })

  const body = (await request.json().catch(() => ({}))) as { to?: string; subject?: string; html?: string; text?: string }
  if (!body.to || !body.subject || (!body.html && !body.text)) {
    return Response.json({ error: "missing_fields" }, { status: 400 })
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
    return Response.json({ result })
  } catch (e) {
    return Response.json({ error: "send_failed", message: e instanceof Error ? e.message : String(e) }, { status: 502 })
  }
}
