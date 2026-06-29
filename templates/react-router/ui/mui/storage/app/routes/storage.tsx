import { useEffect, useRef, useState, type ChangeEvent } from "react"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Alert from "@mui/material/Alert"

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
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
          Storage
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Files are uploaded to your Sentroy bucket through a server route — your access token never reaches the browser.
        </Typography>
      </Box>
      <Box>
        <input ref={inputRef} type="file" style={{ display: "none" }} onChange={onFile} />
        <Button variant="contained" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? "Uploading…" : "Upload a file"}
        </Button>
        {error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : null}
      </Box>
      {items.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr" },
          }}
        >
          {items.map((m) => (
            <Card key={m.id} variant="outlined">
              <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                {m.url && m.type === "image" ? (
                  <Box
                    component="img"
                    src={m.url}
                    alt={m.originalName}
                    sx={{ aspectRatio: "1 / 1", width: "100%", borderRadius: 1, objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      aspectRatio: "1 / 1",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1,
                      bgcolor: "action.hover",
                      color: "text.disabled",
                      fontSize: 12,
                      textTransform: "uppercase",
                    }}
                  >
                    {m.type}
                  </Box>
                )}
                <Typography
                  variant="caption"
                  component="div"
                  title={m.originalName}
                  sx={{ mt: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {m.originalName}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No files yet — upload one above.
        </Typography>
      )}
    </Stack>
  )
}
