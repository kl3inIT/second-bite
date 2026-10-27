import { describe, expect, it } from "vitest";

import { tonightAt } from "@/features/offers/tonight";

import { readSearchQuery, searchHref } from "./search-query";

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

describe("searchHref", () => {
  it("keeps the other filters, drops a key changed to nothing, and leaves out an empty search", () => {
    const query = {
      q: "bánh",
      near: "21.057,105.896",
      radiusKm: 2 as const,
      sort: "price" as const,
    };
    expect(searchHref(query, { sort: undefined })).toBe(
      "/search?q=bánh&near=21.057,105.896&radiusKm=2",
    );
    expect(searchHref(query, { minPrice: 20_000, maxPrice: 40_000 })).toBe(
      "/search?q=bánh&near=21.057,105.896&radiusKm=2&minPrice=20000&maxPrice=40000&sort=price",
    );
    expect(searchHref({}, { now: true })).toBe("/search?now=1");
    expect(searchHref({})).toBe("/search");
  });

  it("writes what readSearchQuery reads back", () => {
    const query = readSearchQuery({ kind: "bakery", from: "21:00", to: "22:00" });
    const params = Object.fromEntries(new URLSearchParams(searchHref(query).split("?")[1]));
    expect(readSearchQuery(params)).toEqual(query);
  });
});

describe("tonightAt", () => {
  it("places a time of day on today's date in Vietnam", () => {
    // 18:30 UTC on 19 October is 01:30 on 20 October in Vietnam.
    expect(tonightAt("20:00", new Date("2026-10-19T18:30:00Z"))).toBe("2026-10-20T20:00:00+07:00");
    expect(tonightAt(undefined)).toBeUndefined();
  });
});
