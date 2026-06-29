import type { Config } from "@react-router/dev/config"

export default {
  // Server-side rendering — required so secret keys stay on the server
  // (loaders/actions) and never reach the browser.
  ssr: true,
} satisfies Config
