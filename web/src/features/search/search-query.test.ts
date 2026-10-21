import { describe, expect, it } from "vitest";

import { tonightAt } from "@/features/offers/tonight";

import { readSearchQuery } from "./search-query";

describe("readSearchQuery", () => {
  it("keeps a price range in order, either end alone, and nothing out of order", () => {
    expect(readSearchQuery({ minPrice: "20000", maxPrice: "50000" })).toMatchObject({
      minPrice: 20_000,
      maxPrice: 50_000,
    });
    expect(readSearchQuery({ maxPrice: "30000" })).toMatchObject({ maxPrice: 30_000 });
    const reversed = readSearchQuery({ minPrice: "50000", maxPrice: "20000" });
    expect([reversed.minPrice, reversed.maxPrice]).toEqual([undefined, undefined]);
    expect(readSearchQuery({ minPrice: "-5", maxPrice: "abc" }).maxPrice).toBeUndefined();
  });

  it("reads times of day, and lets a range of times replace collecting now", () => {
    expect(readSearchQuery({ from: "20:00", to: "21:30", now: "1" })).toMatchObject({
      from: "20:00",
      to: "21:30",
      now: undefined,
    });
    expect(readSearchQuery({ from: "25:00" }).from).toBeUndefined();
    expect(readSearchQuery({ from: "22:00", to: "21:00" }).from).toBeUndefined();
  });
});

describe("tonightAt", () => {
  it("places a time of day on today's date in Vietnam", () => {
    // 18:30 UTC on 19 October is 01:30 on 20 October in Vietnam.
    expect(tonightAt("20:00", new Date("2026-10-19T18:30:00Z"))).toBe("2026-10-20T20:00:00+07:00");
    expect(tonightAt(undefined)).toBeUndefined();
  });
});
