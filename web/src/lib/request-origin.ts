/** The origin a request was addressed to: the proxy's scheme and the host it was asked for. */
export function requestOrigin(request: Request): string {
  const url = new URL(request.url);
  const host = request.headers.get("host") ?? url.host;
  const forwarded = request.headers.get("x-forwarded-proto");
  const scheme =
    forwarded === "http" || forwarded === "https" ? forwarded : url.protocol.slice(0, -1);
  return `${scheme}://${host}`;
}
