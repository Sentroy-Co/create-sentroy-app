import { data, redirect, useLoaderData } from "react-router"
import { resolveSession } from "@/lib/session.server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function meta() {
  return [{ title: "Dashboard" }]
}

export async function loader({ request }: { request: Request }) {
  const { user, setCookie } = await resolveSession(request)
  if (!user) throw redirect("/login")
  return data({ user }, setCookie ? { headers: { "Set-Cookie": setCookie } } : undefined)
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
        <p className="text-neutral-500">User ID: {user.id}</p>
        <p className="text-neutral-500">Email verified: {String(user.emailVerified)}</p>
        <p className="mt-2 text-neutral-500">
          This route is protected server-side: the loader verifies your session token (refreshing it if needed) and
          redirects to /login when absent. Use the header to sign out.
        </p>
      </CardContent>
    </Card>
  )
}
