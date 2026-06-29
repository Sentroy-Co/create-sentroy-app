import { redirect, useLoaderData } from "react-router"
import { auth } from "@/lib/auth.server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <p>
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
        <p className="text-muted-foreground">User ID: {user.id}</p>
        <p className="text-muted-foreground">Email verified: {String(user.emailVerified)}</p>
        <p className="mt-2 text-muted-foreground">
          Auth is managed by better-auth (self-hosted, SQLite). This route is protected server-side: the loader verifies
          your session and redirects to /login when absent. Use the header to sign out.
        </p>
      </CardContent>
    </Card>
  )
}
