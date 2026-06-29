import { sentroy, sentroyConfigured } from "@/lib/sentroy-server.server"

export async function loader({ request }: { request: Request }) {
  if (!sentroyConfigured()) return Response.json({ error: "storage_not_configured" }, { status: 500 })
  const bucket = process.env.SENTROY_STORAGE_BUCKET ?? "uploads"
  const limit = Number(new URL(request.url).searchParams.get("limit") ?? "24")
  try {
    const res = await sentroy().media.list(bucket, { limit })
    return Response.json({ items: res.items, total: res.total })
  } catch (e) {
    return Response.json({ error: "list_failed", message: e instanceof Error ? e.message : String(e) }, { status: 502 })
  }
}
