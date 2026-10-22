import { describe, expect, it } from "vitest";

import { viewOf } from "./count-view";

const none = new URLSearchParams();

// SEC-80: what a page on screen tells the server.
describe("viewOf", () => {
  it("counts a customer's page with its locale", () => {
    expect(viewOf("/vi/sellers/abc", none, false)).toEqual({ path: "/vi/sellers/abc" });
  });

  it("keeps where the visit came from", () => {
    expect(viewOf("/vi", new URLSearchParams("utm_source=qr"), false)).toEqual({
      path: "/vi",
      source: "qr",
    });
  });

  it("leaves out the admin's and a store's own pages", () => {
    for (const path of ["/vi/admin", "/en/admin/reports", "/vi/stores/abc/orders", "/admin"])
      expect(viewOf(path, none, false)).toBeNull();
    expect(viewOf("/vi/storesfront", none, false)).toEqual({ path: "/vi/storesfront" });
  });

  it("leaves out a browser driven by a program", () => {
    expect(viewOf("/vi", none, true)).toBeNull();
  });
});
