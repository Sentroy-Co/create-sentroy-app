import { sentroy, sentroyConfigured } from "@/lib/sentroy-server.server"

export async function action({ request }: { request: Request }) {
  if (!sentroyConfigured()) return Response.json({ error: "storage_not_configured" }, { status: 500 })
  const bucket = process.env.SENTROY_STORAGE_BUCKET ?? "uploads"

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 })
  }
  const file = form.get("file")
  if (!(file instanceof File)) return Response.json({ error: "file_required" }, { status: 400 })
  const folder = (form.get("folder") as string) || "uploads"

  try {
    const media = await sentroy().media.upload(bucket, { body: file, filename: file.name, folder, isPublic: true })
    return Response.json({ media })
  } catch (e) {
    return Response.json({ error: "upload_failed", message: e instanceof Error ? e.message : String(e) }, { status: 502 })
  }
}
