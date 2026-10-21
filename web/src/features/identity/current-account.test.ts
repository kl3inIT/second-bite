import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api/client";

const session = vi.hoisted(() => ({ value: undefined as string | undefined }));
const getMyAccount = vi.hoisted(() => vi.fn());

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === "secondbite_session" && session.value ? { name, value: session.value } : undefined,
  }),
}));
vi.mock("@/lib/api/generated", () => ({ getMyAccount }));
// requireAdmin, beside it, redirects and refuses through Next and next-intl, which do not load in Node.
vi.mock("next/navigation", () => ({ notFound: vi.fn() }));
vi.mock("next-intl/server", () => ({ getLocale: vi.fn() }));
vi.mock("@/i18n/navigation", () => ({ redirect: vi.fn() }));

const { getCurrentAccount } = await import("./current-account");

describe("the current account", () => {
  beforeEach(() => {
    session.value = undefined;
    getMyAccount.mockReset();
  });

  it("is nobody without a session cookie, without asking the API", async () => {
    expect(await getCurrentAccount()).toBeNull();
    expect(getMyAccount).not.toHaveBeenCalled();
  });

  it("keeps the role GET /accounts/me answers, which the admin pages need", async () => {
    session.value = "token";
    getMyAccount.mockResolvedValue({
      data: { id: "ac-1", email: "quantri@example.com", displayName: "", role: "admin" },
    });

    expect(await getCurrentAccount()).toEqual({
      email: "quantri@example.com",
      displayName: "",
      role: "admin",
    });
    expect(getMyAccount).toHaveBeenCalledWith({
      headers: { cookie: "secondbite_session=token" },
    });
  });

  it("is nobody once the session has ended", async () => {
    session.value = "ended";
    getMyAccount.mockRejectedValue(new ApiError(401, undefined));

    expect(await getCurrentAccount()).toBeNull();
  });
});
