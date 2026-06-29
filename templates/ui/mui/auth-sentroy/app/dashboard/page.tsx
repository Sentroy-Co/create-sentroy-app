import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

export default async function DashboardPage() {
  const user = await getSession()
  if (!user) redirect("/login")

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
            This page is protected by middleware + a server-side token check. Use the header to sign out.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}
