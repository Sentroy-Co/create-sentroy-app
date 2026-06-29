import { useEffect, useState } from "react"
import { Link as RouterLink } from "react-router"
import { features } from "@/lib/features"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"

export function SiteHeader() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(features.auth)

  useEffect(() => {
    if (!features.auth) return
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((j) => setUser(j.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    window.location.href = "/"
  }

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "text.primary", textDecoration: "none" }}
        >
          {{PROJECT_NAME}}
        </Typography>
        <Box component="nav" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {features.storage ? (
            <Button component={RouterLink} to="/storage" color="inherit" size="small" sx={{ textTransform: "none" }}>
              Storage
            </Button>
          ) : null}
          {features.email ? (
            <Button component={RouterLink} to="/email" color="inherit" size="small" sx={{ textTransform: "none" }}>
              Email
            </Button>
          ) : null}
          {features.auth && user ? (
            <Button component={RouterLink} to="/dashboard" color="inherit" size="small" sx={{ textTransform: "none" }}>
              Dashboard
            </Button>
          ) : null}
        </Box>
        {features.auth ? (
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
            {loading ? null : user ? (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "inline" } }}>
                  {user.email}
                </Typography>
                <Button variant="outlined" size="small" onClick={() => void signOut()}>
                  Sign out
                </Button>
              </>
            ) : (
              <Button component={RouterLink} to="/login" variant="contained" size="small">
                Sign in
              </Button>
            )}
          </Box>
        ) : null}
      </Toolbar>
    </AppBar>
  )
}
