import createCache from "@emotion/cache"

// Shared Emotion cache key for MUI styles. Used by both the client entry and the
// server entry (for SSR critical-CSS extraction) so markup matches on hydration.
export default function createEmotionCache() {
  return createCache({ key: "css" })
}
