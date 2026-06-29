import { Link as RouterLink } from "react-router"
import { features } from "@/lib/features"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"

export function meta() {
  return [{ title: "{{PROJECT_NAME}}" }]
}

const items = [
  features.auth ? { to: "/login", title: "Auth", desc: "Sign up & sign in your users." } : null,
  features.storage ? { to: "/storage", title: "Storage", desc: "Upload & list files." } : null,
  features.email ? { to: "/email", title: "Email", desc: "Send transactional email." } : null,
].filter(Boolean) as { to: string; title: string; desc: string }[]

export default function Home() {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
          {{PROJECT_NAME}}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Your Sentroy-powered React Router app is ready. Fill in{" "}
          <Box
            component="code"
            sx={{ borderRadius: 1, bgcolor: "action.hover", px: 0.5, fontFamily: "monospace" }}
          >
            .env.local
          </Box>{" "}
          and explore the wired services.
        </Typography>
      </Box>
      {items.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          {items.map((it) => (
            <Card key={it.to} variant="outlined">
              <CardActionArea component={RouterLink} to={it.to}>
                <CardContent>
                  <Typography sx={{ fontWeight: 600 }}>{it.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {it.desc}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography color="text.secondary">No Sentroy services were selected at scaffold time.</Typography>
      )}
    </Stack>
  )
}
