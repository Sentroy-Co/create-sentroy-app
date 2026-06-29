import { Link as RouterLink } from "react-router"
import { features } from "@/lib/features"
import { authClient } from "@/lib/auth-client"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"

export function SiteHeader() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
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
          {user ? (
            <Button component={RouterLink} to="/dashboard" color="inherit" size="small" sx={{ textTransform: "none" }}>
              Dashboard
            </Button>
          ) : null}
        </Box>
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
          {isPending ? null : user ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "inline" } }}>
                {user.email}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => authClient.signOut().then(() => (window.location.href = "/"))}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button component={RouterLink} to="/login" variant="contained" size="small">
              Sign in
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
