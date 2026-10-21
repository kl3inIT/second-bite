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
} from "./post-draft";

describe("the price of a post", () => {
  it("caps the price at the minimum discount below the original: 76.000đ for 95.000đ", () => {
    expect(maxPrice(95_000)).toBe(76_000);
    expect(priceProblem(95_000, 76_000)).toBeUndefined();
    expect(priceProblem(95_000, 80_000)).toBe("tooHigh");
  });

  it("suggests the dearest whole-hundred price within the minimum discount", () => {
    expect(suggestedPrice(95_000)).toBe(76_000);
    expect(suggestedPrice(30_000)).toBe(24_000);
    expect(suggestedPrice(9_990)).toBe(7_900);
    expect(discountPercent(9_990, 7_900)).toBe(20);
    expect(suggestedPrice(1_500)).toBe(1_200);
    expect(suggestedPrice(1_200)).toBeUndefined();
    expect(suggestedPrice(Number.NaN)).toBeUndefined();
    expect(priceProblem(95_000, suggestedPrice(95_000) ?? 0)).toBeUndefined();
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
      photos: [
        { id: `ph-${name}`, smallPath: `/photos/ph-${name}/400.jpg` },
        { id: `ph-${name}-2`, smallPath: `/photos/ph-${name}-2/400.jpg` },
      ],
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

  it("carries the photos after the cover, so a new post of the dish shows them too", () => {
    const [dish] = dishesOf([offer("Bánh mì", "2026-10-19T13:30:00Z")]);
    expect(dish?.photoId).toBe("ph-Bánh mì");
    expect(dish?.morePhotoIds).toEqual(["ph-Bánh mì-2"]);
  });
});
