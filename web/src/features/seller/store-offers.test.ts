import { describe, expect, it } from "vitest";

import type { OfferBody } from "@/lib/api/generated";

import { groupByTab, matchesName, offersOfDay } from "./store-offers";

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
});

describe("a store's posts of a day", () => {
  const post = (id: string, name: string, windowStart: string) =>
    ({ id, name, windowStart }) as OfferBody;
  const posts = [
    post("a", "Xôi thập cẩm", "2026-10-21T13:30:00Z"),
    // 02:00 on the 22nd in Vietnam, though still the 21st in UTC.
    post("b", "Bánh mì que", "2026-10-21T19:00:00Z"),
    post("c", "Cơm sườn nướng", "2026-10-20T11:00:00Z"),
  ];

  it("belongs to the day its window opens, in Vietnam's time", () => {
    expect(offersOfDay(posts, "2026-10-21").map((p) => p.id)).toEqual(["a"]);
    expect(offersOfDay(posts, "2026-10-22").map((p) => p.id)).toEqual(["b"]);
    expect(offersOfDay(posts, "2026-10-20").map((p) => p.id)).toEqual(["c"]);
    expect(offersOfDay(posts, "2026-10-23")).toEqual([]);
  });

  it("is found by its name, without accents or case, and every post by an empty search", () => {
    expect(matchesName(posts[0], "xoi")).toBe(true);
    expect(matchesName(posts[0], "THẬP")).toBe(true);
    expect(matchesName(posts[0], "com")).toBe(false);
    expect(matchesName(posts[0], "  ")).toBe(true);
  });
});
