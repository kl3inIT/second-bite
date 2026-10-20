import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError, createClientConfig, failureOf } from "./client";

const problem = {
  type: "urn:secondbite:failure:platform-request-invalid",
  title: "Bad Request",
  status: 400,
  code: "PLATFORM_REQUEST_INVALID",
  requestId: "REQ1",
  errors: [{ pointer: "#/email", detail: "expected length >= 3", code: "PLATFORM_VALUE_INVALID" }],
};

function apiFetch() {
  const { fetch } = createClientConfig({});
  if (!fetch) throw new Error("createClientConfig sets no fetch");
  return fetch;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("the client's fetch", () => {
  it("returns a successful response as it came", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ id: "a1" })),
    );

    const response = await apiFetch()("/accounts/me");

    expect(await response.json()).toEqual({ id: "a1" });
  });

  it("rejects a failed request with the backend's problem", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json(problem, { status: 400 })),
    );

    const error: unknown = await apiFetch()("/auth/sign-in-codes").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    const apiError = error as ApiError;
    expect(apiError.status).toBe(400);
    expect(apiError.code).toBe("PLATFORM_REQUEST_INVALID");
    expect(apiError.requestId).toBe("REQ1");
    expect(apiError.violations).toEqual(problem.errors);
  });

  it("keeps the status when the failure is not a problem, such as a proxy's error page", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("<html>Bad gateway</html>", { status: 502 })),
    );

    const error = (await apiFetch()("/accounts/me").catch((e: unknown) => e)) as ApiError;

    expect(error.status).toBe(502);
    expect(error.problem).toBeUndefined();
    expect(error.violations).toEqual([]);
  });

  it("rejects without a status when no answer came", async () => {
    const offline = new TypeError("fetch failed");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(offline)),
    );

    const error = (await apiFetch()("/accounts/me").catch((e: unknown) => e)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBeUndefined();
    expect(error.cause).toBe(offline);
  });
});

describe("the language of the backend's words (SEC-28)", () => {
  function sentHeaders(fetchMock: ReturnType<typeof vi.fn>) {
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    return new Headers(init?.headers);
  }

  it("asks in the page's language in the browser", async () => {
    const fetchMock = vi.fn(async () => Response.json({}));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", { documentElement: { lang: "en" } });

    await apiFetch()("/offers");

    expect(sentHeaders(fetchMock).get("accept-language")).toBe("en");
  });

  it("keeps a language the caller chose", async () => {
    const fetchMock = vi.fn(async () => Response.json({}));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", { documentElement: { lang: "en" } });

    await apiFetch()("/offers", { headers: { "Accept-Language": "vi" } });

    expect(sentHeaders(fetchMock).get("accept-language")).toBe("vi");
  });

  it("gives a screen the server's sentence and the request's reference", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ ...problem, detail: "Yêu cầu chưa hợp lệ." }, { status: 400 }),
      ),
    );

    const error = await apiFetch()("/sellers").catch((e: unknown) => e);

    expect((error as ApiError).detail).toBe("Yêu cầu chưa hợp lệ.");
    expect(failureOf(error)).toEqual({ detail: "Yêu cầu chưa hợp lệ.", reference: "REQ1" });
    expect(failureOf(new TypeError("fetch failed"))).toEqual({});
  });
});

describe("the client's base address", () => {
  it("calls the Go server directly from server code", () => {
    vi.stubEnv("SECONDBITE_API_ORIGIN", "http://localhost:8080");

    expect(createClientConfig({}).baseUrl).toBe("http://localhost:8080");

    vi.unstubAllEnvs();
  });
});
