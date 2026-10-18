import type { CreateClientConfig } from "./generated/client.gen";
import type { Problem } from "./generated/types.gen";

/**
 * A request to the backend that did not succeed. `status` is missing when no answer came at all: the
 * network failed or the request ran out of time. The backend answers every failure with an RFC 9457
 * problem; `code` is what callers branch on and translate, never the problem's text.
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

  /** The identifier of the request in the backend's logs (X-Request-Id); shown when a person reports a failure. */
  get requestId() {
    return this.problem?.requestId;
  }

  /** One entry per rejected member of the request; empty unless validation failed. */
  get violations() {
    return this.problem?.errors ?? [];
  }
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

/** The fetch every generated SDK call goes through: a failed request, answered or not, becomes an ApiError. */
async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(input, init);
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
