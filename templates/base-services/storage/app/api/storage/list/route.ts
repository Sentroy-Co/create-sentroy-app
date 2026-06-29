import { NextResponse } from "next/server"
import { sentroy, sentroyConfigured } from "@/lib/sentroy-server"

export const runtime = "nodejs"

export async function GET(req: Request) {
  if (!sentroyConfigured()) return NextResponse.json({ error: "storage_not_configured" }, { status: 500 })
  const bucket = process.env.SENTROY_STORAGE_BUCKET ?? "uploads"
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? "24")

  try {
    const res = await sentroy().media.list(bucket, { limit })
    return NextResponse.json({ items: res.items, total: res.total })
  } catch (e) {
    return NextResponse.json(
      { error: "list_failed", message: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    )
  }
}
