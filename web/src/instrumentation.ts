import type { Instrumentation } from "next";

/**
 * One line of JSON for every error the server catches while rendering, so a failure a person reports
 * by its reference can be found: the digest is the reference the error screen shows. The error's
 * text, the query string and the headers are left out, because any of them can carry personal data
 * (docs/conventions.md › Logging). As in BeyondPilot's web/src/instrumentation.ts.
 */
export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
  console.error(
    JSON.stringify({
      level: "error",
      event: "web.render.failed",
      error_type: error instanceof Error ? error.name : typeof error,
      digest:
        typeof error === "object" && error !== null && "digest" in error
          ? String(error.digest)
          : undefined,
      method: request.method,
      route: context.routePath,
      route_type: context.routeType,
    }),
  );
};
