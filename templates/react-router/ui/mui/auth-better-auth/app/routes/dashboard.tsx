import { redirect, useLoaderData } from "react-router"
import { auth } from "@/lib/auth.server"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

export function meta() {
  return [{ title: "Dashboard" }]
}

export async function loader({ request }: { request: Request }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) throw redirect("/login")
  return { user: session.user }
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>()
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
            Auth is managed by better-auth (self-hosted, SQLite). This route is protected server-side: the loader
            verifies your session and redirects to /login when absent. Use the header to sign out.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}
