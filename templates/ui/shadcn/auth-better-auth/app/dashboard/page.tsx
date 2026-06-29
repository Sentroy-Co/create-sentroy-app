import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")
  const { user } = session

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
          Auth is managed by better-auth (self-hosted, SQLite). This route is gated by middleware + a server-side session
          check. Use the header to sign out.
        </p>
      </CardContent>
    </Card>
  )
}
