import { describe, expect, it } from "vitest";

import {
  loadOrderSearchParams,
  loadPostSearchParams,
  serializeOrderSearchParams,
  serializePostSearchParams,
} from "./search-params";

describe("a store list's address", () => {
  it("reads a real day, and no day for one that is not", () => {
    expect(loadOrderSearchParams("?day=2026-10-19").day).toBe("2026-10-19");
    expect(loadOrderSearchParams("?day=2026-02-30").day).toBeNull();
    expect(loadOrderSearchParams("?day=hôm-qua").day).toBeNull();
    expect(loadOrderSearchParams("").day).toBeNull();
  });

  it("opens on its first tab when the tab is missing or unknown", () => {
    expect(loadOrderSearchParams("?tab=ready").tab).toBe("ready");
    expect(loadOrderSearchParams("?tab=nonsense").tab).toBe("preparing");
    expect(loadPostSearchParams("?tab=closed").tab).toBe("closed");
    expect(loadPostSearchParams("?tab=withdrawn").tab).toBe("on_sale");
  });

  it("leaves out what is as the list opens", () => {
    expect(serializeOrderSearchParams({ day: null, tab: "preparing", q: "" })).toBe("");
    expect(serializeOrderSearchParams({ day: "2026-10-19", tab: "ready", q: "lan" })).toBe(
      "?day=2026-10-19&tab=ready&q=lan",
    );
    expect(serializePostSearchParams({ day: null, tab: "on_sale", q: "bánh" })).toBe("?q=bánh");
  });
});
