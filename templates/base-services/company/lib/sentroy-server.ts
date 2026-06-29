import { Sentroy } from "@sentroy-co/client-sdk"

// Company-scoped Sentroy client (Storage + Email). Uses the stk_ access token,
// which is admin over your company — SERVER-ONLY. Never import this in a client
// component or expose the token via NEXT_PUBLIC_*.

let _client: Sentroy | null = null

export function sentroy(): Sentroy {
  if (!_client) {
    _client = new Sentroy({
      baseUrl: process.env.SENTROY_BASE_URL ?? "https://sentroy.com",
      companySlug: process.env.SENTROY_COMPANY_SLUG ?? "",
      accessToken: process.env.SENTROY_ACCESS_TOKEN ?? "",
    })
  }
  return _client
}

export function sentroyConfigured(): boolean {
  return Boolean(process.env.SENTROY_COMPANY_SLUG && process.env.SENTROY_ACCESS_TOKEN)
}
