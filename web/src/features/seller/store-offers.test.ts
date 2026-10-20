import { describe, expect, it } from "vitest";

import type { OfferBody } from "@/lib/api/generated";

import { groupByTab, readPostTab } from "./store-offers";

const offer = (id: string, status: OfferBody["status"]) => ({ id, status }) as OfferBody;

describe("a store's post tabs", () => {
  it("puts a closed and a withdrawn post in the same tab, and keeps the order", () => {
    const groups = groupByTab([
      offer("a", "on_sale"),
      offer("b", "closed"),
      offer("c", "sold_out"),
      offer("d", "withdrawn"),
    ]);
    expect(groups.on_sale.map((o) => o.id)).toEqual(["a"]);
    expect(groups.sold_out.map((o) => o.id)).toEqual(["c"]);
    expect(groups.closed.map((o) => o.id)).toEqual(["b", "d"]);
  });

  it("reads the tab from the address, on sale when it is missing or unknown", () => {
    expect(readPostTab("closed")).toBe("closed");
    expect(readPostTab("withdrawn")).toBe("on_sale");
    expect(readPostTab(undefined)).toBe("on_sale");
  });
});
