import { useState, type FormEvent } from "react"
import { Link } from "react-router"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function meta() {
  return [{ title: "Sign in" }]
}

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await authClient.signIn.email({ email, password })
    setBusy(false)
    if (error) return setError(error.message ?? "Login failed")
    window.location.href = "/dashboard"
  }

  function signInWithSentroy() {
    void authClient.signIn.oauth2({ providerId: "sentroy", callbackURL: "/dashboard" })
  }

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <div className="my-4 text-center text-xs text-muted-foreground">or</div>
          <Button type="button" variant="outline" className="w-full" onClick={signInWithSentroy}>
            Sign in with Sentroy
          </Button>
          <div className="mt-4 text-sm text-muted-foreground">
            No account?{" "}
            <Link to="/signup" className="hover:underline">
              Create one
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
