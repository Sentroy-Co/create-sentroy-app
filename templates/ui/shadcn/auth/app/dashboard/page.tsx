import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const user = await getSession()
  if (!user) redirect("/login")

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
        <p className="mt-2 text-muted-foreground">This page is protected by middleware + a server-side token check. Use the header to sign out.</p>
      </CardContent>
    </Card>
  )
}
