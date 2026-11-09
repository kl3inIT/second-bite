import { hanoiStyle } from "@/components/map/map-style";
import { requestOrigin } from "@/lib/request-origin";

/**
 * The map's style as a file, for the app (SEC-206): MapLibre Native reads a style from an address and cannot run
 * `@protomaps/basemaps`, so the site answers the same `hanoiStyle` its own maps build in the browser. The archive,
 * glyphs and sprites are on the origin the request came to, so staging's style reads staging's map and production's
 * production's. The edge proxy sets `Host` and `X-Forwarded-Proto` (docs/runbooks/ci-cd.md).
 */
export function GET(request: Request): Response {
  return Response.json(hanoiStyle(requestOrigin(request)), {
    headers: { "Cache-Control": "public, max-age=3600", Vary: "Host, X-Forwarded-Proto" },
  });
}
