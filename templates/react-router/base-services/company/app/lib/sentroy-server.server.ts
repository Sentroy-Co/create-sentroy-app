import { Sentroy } from "@sentroy-co/client-sdk"

// Company-scoped Sentroy client (Storage + Email). Uses the stk_ access token —
// admin over your company. SERVER-ONLY (.server.ts is never bundled to client).

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
