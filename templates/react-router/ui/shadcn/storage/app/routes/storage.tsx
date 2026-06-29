import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function meta() {
  return [{ title: "Storage" }]
}

interface MediaItem {
  id: string
  originalName: string
  type: string
  size: number
  url?: string
}

export default function Storage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function load() {
    const r = await fetch("/api/storage/list")
    const j = await r.json().catch(() => ({}))
    if (r.ok) setItems(j.items ?? [])
  }
  useEffect(() => {
    void load()
  }, [])

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    setError(null)
    const fd = new FormData()
    fd.append("file", f)
    const r = await fetch("/api/storage/upload", { method: "POST", body: fd })
    const j = await r.json().catch(() => ({}))
    setBusy(false)
    if (!r.ok) {
      setError(j.message || j.error || "Upload failed")
      return
    }
    await load()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Storage</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Files are uploaded to your Sentroy bucket through a server route — your access token never reaches the browser.
        </p>
      </div>
      <div>
        <input ref={inputRef} type="file" className="hidden" onChange={onFile} />
        <Button onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? "Uploading…" : "Upload a file"}
        </Button>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-3">
                {m.url && m.type === "image" ? (
                  <img src={m.url} alt={m.originalName} className="aspect-square w-full rounded object-cover" />
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded bg-neutral-100 text-xs uppercase text-neutral-400 dark:bg-neutral-900">
                    {m.type}
                  </div>
                )}
                <div className="mt-2 truncate text-xs" title={m.originalName}>
                  {m.originalName}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-500">No files yet — upload one above.</p>
      )}
    </div>
  )
}
