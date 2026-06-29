import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")
  const { user } = session

  return (
    <Card variant="outlined">
      <CardHeader title="Dashboard" />
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="body2">
            Signed in as <Box component="span" sx={{ fontWeight: 500 }}>{user.email}</Box>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User ID: {user.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email verified: {String(user.emailVerified)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Auth is managed by better-auth (self-hosted, SQLite). This route is gated by middleware + a server-side
            session check. Use the header to sign out.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}
