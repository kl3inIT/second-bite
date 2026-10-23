import { describe, expect, it } from "vitest";

import type { OfferBody } from "@/lib/api/generated";

import {
  clock,
  discountPercent,
  dishesOf,
  lengthIsAllowed,
  maxPrice,
  suggestedPrice,
  priceProblem,
  windowIsOver,
  windowOf,
  nextStart,
  minutesUntil,
  startSuggestions,
  clockOf,
} from "./post-draft";

describe("the price of a post", () => {
  it("caps the price at the minimum discount below the original: 76.000đ for 95.000đ", () => {
    expect(maxPrice(95_000)).toBe(76_000);
    expect(priceProblem(95_000, 76_000)).toBeUndefined();
    expect(priceProblem(95_000, 80_000)).toBe("tooHigh");
  });

  it("calculates percentages in whole đồng without an extra hundred-đồng rounding", () => {
    expect(suggestedPrice(95_000)).toBe(76_000);
    expect(suggestedPrice(30_000)).toBe(24_000);
    expect(suggestedPrice(9_990)).toBe(7_992);
    expect(discountPercent(9_990, 7_900)).toBe(20);
    expect(suggestedPrice(1_500)).toBe(1_200);
    expect(suggestedPrice(1_200)).toBeUndefined();
    expect(suggestedPrice(Number.NaN)).toBeUndefined();
    expect(priceProblem(95_000, suggestedPrice(95_000) ?? 0)).toBeUndefined();
    expect(suggestedPrice(20_000, 35)).toBe(13_000);
    expect(suggestedPrice(9_999, 35)).toBe(6_499);
    expect(suggestedPrice(20_000, 90)).toBe(2_000);
    expect(suggestedPrice(20_000, 99)).toBeUndefined();
    for (const percent of [19, 100, 35.5, Number.NaN])
      expect(suggestedPrice(20_000, percent)).toBeUndefined();
  });

  it("asks for both prices, each at least 1.000đ", () => {
    expect(priceProblem(95_000, Number.NaN)).toBe("missing");
    expect(priceProblem(Number.NaN, 57_000)).toBe("missing");
    expect(priceProblem(95_000, 500)).toBe("missing");
  });

  it("says the discount in whole percent, rounded down", () => {
    expect(discountPercent(95_000, 57_000)).toBe(40);
    expect(discountPercent(30_000, 20_000)).toBe(33);
  });
});

describe("the window of a post", () => {
  const now = new Date("2026-10-20T12:00:00+07:00");

  it("reads a time of day in Vietnam's time, whatever the device's", () => {
    const window = windowOf({ kind: "at", hour: 20, minute: 30 }, 60, now);
    expect(window.start.toISOString()).toBe("2026-10-20T13:30:00.000Z");
    expect(window.end.toISOString()).toBe("2026-10-20T14:30:00.000Z");
  });

  it("starts now at the minute the post is made", () => {
    const window = windowOf({ kind: "now" }, 30, new Date("2026-10-20T12:00:45+07:00"));
    expect(window.start.toISOString()).toBe("2026-10-20T05:00:00.000Z");
  });

  it("is over once its last handover has passed", () => {
    const window = windowOf({ kind: "at", hour: 9, minute: 0 }, 60, now);
    expect(windowIsOver(window, now)).toBe(true);
    expect(windowIsOver(windowOf({ kind: "at", hour: 11, minute: 30 }, 60, now), now)).toBe(false);
  });

  it("allows half an hour to six hours", () => {
    expect(lengthIsAllowed(30)).toBe(true);
    expect(lengthIsAllowed(360)).toBe(true);
    expect(lengthIsAllowed(15)).toBe(false);
    expect(lengthIsAllowed(361)).toBe(false);
  });

  it("writes a clock time with two digits", () => {
    expect(clock(9, 5)).toBe("09:05");
  });

  it("suggests current time and future whole hours in Vietnam, across midnight", () => {
    const suggestions = startSuggestions(new Date("2026-10-20T23:45:39+07:00"));
    expect(suggestions.map(clockOf)).toEqual([
      { hour: 23, minute: 45 },
      { hour: 0, minute: 0 },
      { hour: 1, minute: 0 },
      { hour: 2, minute: 0 },
    ]);
    expect(suggestions[1]?.toISOString()).toBe("2026-10-20T17:00:00.000Z");
    expect(startSuggestions(new Date("2026-10-20T07:00:00+07:00")).map(clockOf)).toEqual([
      { hour: 7, minute: 0 },
      { hour: 8, minute: 0 },
      { hour: 9, minute: 0 },
      { hour: 10, minute: 0 },
    ]);
  });

  it("retains the day for a future custom start and advances past clock times to tomorrow", () => {
    expect(nextStart(12, 0, now).toISOString()).toBe("2026-10-20T05:00:00.000Z");
    expect(nextStart(13, 30, now).toISOString()).toBe("2026-10-20T06:30:00.000Z");
    expect(nextStart(1, 5, now).toISOString()).toBe("2026-10-20T18:05:00.000Z");
  });

  it("reads a custom end relative to the start, including midnight and every minute", () => {
    const start = new Date("2026-10-20T23:15:00+07:00");
    expect(minutesUntil(start, 0, 45)).toBe(90);
    expect(minutesUntil(start, 1, 7)).toBe(112);
    expect(lengthIsAllowed(minutesUntil(start, 23, 20))).toBe(false);
    expect(lengthIsAllowed(minutesUntil(start, 23, 0))).toBe(false);
    expect(lengthIsAllowed(minutesUntil(start, 23, 15))).toBe(false);
  });
});

describe("the dishes of earlier posts", () => {
  const offer = (name: string, windowStart: string) =>
    ({
      name,
      kind: "bakery",
      description: "",
      unit: "suất",
      units: 3,
      originalPriceVnd: 95_000,
      priceVnd: 57_000,
      photo: { id: `ph-${name}`, smallPath: `/photos/ph-${name}/400.jpg` },
      windowStart,
    }) as OfferBody;

  it("keeps each dish once, from its latest post, with the hour it was put on sale", () => {
    const dishes = dishesOf([
      offer("Bánh mì", "2026-10-19T13:30:00Z"),
      offer("Xôi", "2026-10-19T14:00:00Z"),
      offer("Bánh mì", "2026-10-18T14:00:00Z"),
    ]);
    expect(dishes.map((d) => d.name)).toEqual(["Bánh mì", "Xôi"]);
    expect(dishes[0]?.usual).toEqual({ hour: 20, minute: 30 });
  });
});
