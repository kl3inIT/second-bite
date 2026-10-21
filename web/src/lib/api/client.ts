import type { CreateClientConfig } from "./generated/client.gen";
import type { Problem } from "./generated/types.gen";

/**
 * A request to the backend that did not succeed. `status` is missing when no answer came at all: the
 * network failed or the request ran out of time. The backend answers every failure with an RFC 9457
 * problem whose `detail` is written for people in the page's language (SEC-28): screens show it, and
 * branch on `code` only to act differently, such as marking a field.
 * Adapted from BeyondPilot's web/src/lib/api/client.ts.
 */
export class ApiError extends Error {
  readonly status: number | undefined;
  readonly problem: Problem | undefined;

  constructor(status: number | undefined, problem: Problem | undefined, cause?: unknown) {
    super(status ? `The backend answered ${status}` : "The backend did not answer", { cause });
    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }

  get code() {
    return this.problem?.code;
  }

  /** The server's sentence for people, in the language the request asked for; missing without an answer. */
  get detail() {
    return this.problem?.detail || undefined;
  }

  /** The identifier of the request in the backend's logs (X-Request-Id); shown when a person reports a failure. */
  get requestId() {
    return this.problem?.requestId;
  }

  /** One entry per rejected member of the request; empty unless validation failed. */
  get violations() {
    return this.problem?.errors ?? [];
  }
}

/**
 * What a screen needs of a failure (SEC-28): the server's sentence for people, missing when no answer came,
 * and the request's reference, quoted when a person reports it.
 */
export function failureOf(error: unknown): { detail?: string; reference?: string } {
  return error instanceof ApiError ? { detail: error.detail, reference: error.requestId } : {};
}

/** The problem a failed response carries, or nothing when its body is something else, such as a proxy's error page. */
async function problemOf(response: Response): Promise<Problem | undefined> {
  try {
    const body: unknown = await response.json();
    return typeof body === "object" && body !== null && "status" in body
      ? (body as Problem)
      : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The language the backend answers in: the page's locale, read from the document in the browser and from
 * next-intl on the server, so the language chosen on the site wins over the browser's. Nothing outside a
 * request, where the backend answers Vietnamese.
 */
async function pageLanguage(): Promise<string | undefined> {
  if (typeof window !== "undefined") return document.documentElement.lang || undefined;
  try {
    const { getLocale } = await import("next-intl/server");
    return await getLocale();
  } catch {
    return undefined;
  }
}

/** The fetch every generated SDK call goes through: a failed request, answered or not, becomes an ApiError. */
async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  const language = headers.has("accept-language") ? undefined : await pageLanguage();
  if (language) headers.set("accept-language", language);

  let response: Response;
  try {
    response = await fetch(input, { ...init, headers });
  } catch (cause) {
    throw new ApiError(undefined, undefined, cause);
  }
  if (!response.ok) {
    throw new ApiError(response.status, await problemOf(response));
  }
  return response;
}

/**
 * Configures the generated client in the browser and on the server alike. The browser calls /api on
 * the origin it is on, which reaches the Go server (next.config.ts in development, the reverse proxy
 * when deployed); the server has no origin of its own and calls the Go server directly.
 */
export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: typeof window === "undefined" ? (process.env.SECONDBITE_API_ORIGIN ?? "") : "/api",
  fetch: apiFetch,
});
