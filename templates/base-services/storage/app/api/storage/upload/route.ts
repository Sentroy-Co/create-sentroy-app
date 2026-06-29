import { NextResponse } from "next/server"
import { sentroy, sentroyConfigured } from "@/lib/sentroy-server"

export const runtime = "nodejs"
export const maxDuration = 60

// Receives a browser upload and forwards it to Sentroy Storage server-side
// (the stk_ token stays on the server).
export async function POST(req: Request) {
  if (!sentroyConfigured()) return NextResponse.json({ error: "storage_not_configured" }, { status: 500 })
  const bucket = process.env.SENTROY_STORAGE_BUCKET ?? "uploads"

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 })
  }
  const file = form.get("file")
  if (!(file instanceof File)) return NextResponse.json({ error: "file_required" }, { status: 400 })
  const folder = (form.get("folder") as string) || "uploads"

  try {
    const media = await sentroy().media.upload(bucket, {
      body: file,
      filename: file.name,
      folder,
      isPublic: true,
    })
    return NextResponse.json({ media })
  } catch (e) {
    return NextResponse.json(
      { error: "upload_failed", message: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    )
  }
}
