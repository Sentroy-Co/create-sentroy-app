import { useState, type FormEvent } from "react"
import { Link } from "react-router"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function meta() {
  return [{ title: "Create account" }]
}

export default function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await authClient.signUp.email({ email, password, name })
    setBusy(false)
    if (error) return setError(error.message ?? "Sign up failed")
    window.location.href = "/dashboard"
  }

  function signInWithSentroy() {
    void authClient.signIn.oauth2({ providerId: "sentroy", callbackURL: "/dashboard" })
  }

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={busy}>
              {busy ? "Creating…" : "Create account"}
            </Button>
          </form>
          <div className="my-4 text-center text-xs text-muted-foreground">or</div>
          <Button type="button" variant="outline" className="w-full" onClick={signInWithSentroy}>
            Sign in with Sentroy
          </Button>
          <div className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
