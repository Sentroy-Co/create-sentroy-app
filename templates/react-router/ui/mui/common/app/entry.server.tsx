import { CacheProvider } from "@emotion/react"
import createEmotionServer from "@emotion/server/create-instance"
import { renderToString } from "react-dom/server"
import { ServerRouter, type EntryContext } from "react-router"
import createEmotionCache from "./createEmotionCache"

// Custom server entry so MUI/Emotion critical CSS is extracted during SSR and
// inlined into the document head (no flash of unstyled content, clean hydration).
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  const cache = createEmotionCache()
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache)

  const html = renderToString(
    <CacheProvider value={cache}>
      <ServerRouter context={routerContext} url={request.url} />
    </CacheProvider>,
  )

  const styles = constructStyleTagsFromChunks(extractCriticalToChunks(html))
  const markup = html.replace("__EMOTION_STYLES__", styles)

  responseHeaders.set("Content-Type", "text/html")
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
