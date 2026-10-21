import { describe, expect, it } from "vitest";

import type { OfferSummary } from "./offer";
import { bestRatedFirst, isAnnouncement, sellerRating, type Announcement } from "./proposed";

function offer(id: string, rating?: unknown, unitsLeft = 3): OfferSummary {
  return {
    id,
    sellerId: `s-${id}`,
    status: unitsLeft > 0 ? "on_sale" : "sold_out",
    name: id,
    description: "",
    kind: "bakery",
    unit: "phần",
    units: 5,
    unitsLeft,
    priceVnd: 20_000,
    originalPriceVnd: 40_000,
    discountPercent: 50,
    photo: { id, largePath: `/photos/${id}/1600.jpg`, smallPath: `/photos/${id}/400.jpg` },
    windowStart: "2026-10-18T21:00:00+07:00",
    windowEnd: "2026-10-18T21:45:00+07:00",
    collectionPoint: { latitude: 21.0565, longitude: 105.8964, address: "Tầng 1" },
    createdAt: "2026-10-18T18:00:00+07:00",
    updatedAt: "2026-10-18T18:00:00+07:00",
    // The rating is not in the contract yet; the stub adds it to the seller.
    seller: { id: `s-${id}`, name: id, address: "Tầng 1", rating } as OfferSummary["seller"],
  };
}

describe("sellerRating", () => {
  it("reads a number and ignores anything else", () => {
    expect(sellerRating(offer("a", 4.7))).toBe(4.7);
    expect(sellerRating(offer("b"))).toBeUndefined();
    expect(sellerRating(offer("c", "4.7"))).toBeUndefined();
  });
});

describe("bestRatedFirst", () => {
  it("keeps what can be ordered from rated sellers, the best-rated first", () => {
    const offers = [offer("low", 4.2), offer("none"), offer("high", 4.9), offer("gone", 5, 0)];
    expect(bestRatedFirst(offers).map(({ id }) => id)).toEqual(["high", "low"]);
  });
});

describe("isAnnouncement", () => {
  it("tells an announcement from an offer", () => {
    const { unitsLeft: _unitsLeft, ...fields } = offer("a");
    const announcement: Announcement = { ...fields, status: "announced", estimatedUnits: 6 };
    expect(isAnnouncement(announcement)).toBe(true);
    expect(isAnnouncement(offer("b"))).toBe(false);
  });
});
