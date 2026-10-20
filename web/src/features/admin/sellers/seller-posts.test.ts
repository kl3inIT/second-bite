import { describe, expect, it } from "vitest";

import type { OfferBody } from "@/lib/api/generated";

import { countPosts, coverPhotos, postsIn, readPostStatus } from "./seller-posts";

function offer(
  id: string,
  status: OfferBody["status"],
  createdAt: string,
  extra: Partial<OfferBody> = {},
): OfferBody {
  return {
    id,
    sellerId: "se-1",
    status,
    name: id,
    description: "",
    kind: "bakery",
    unit: "suất",
    units: 4,
    unitsLeft: 2,
    priceVnd: 57000,
    originalPriceVnd: 95000,
    discountPercent: 40,
    photo: {
      id: `ph-${id}`,
      largePath: `/photos/ph-${id}/1600.jpg`,
      smallPath: `/photos/ph-${id}/400.jpg`,
    },
    windowStart: createdAt,
    windowEnd: createdAt,
    collectionPoint: { address: "Tầng 1", latitude: 21, longitude: 105 },
    createdAt,
    updatedAt: createdAt,
    ...extra,
  };
}

const offers = [
  offer("a", "on_sale", "2026-10-20T15:00:00+07:00"),
  offer("b", "on_sale", "2026-10-20T16:00:00+07:00"),
  offer("c", "sold_out", "2026-10-19T16:00:00+07:00"),
  offer("d", "withdrawn", "2026-10-10T08:00:00+07:00", {
    withdrawnAt: "2026-10-20T18:00:00+07:00",
  }),
  offer("e", "withdrawn", "2026-10-19T08:00:00+07:00", {
    withdrawnAt: "2026-10-19T09:00:00+07:00",
  }),
];

describe("a store's posts", () => {
  it("read their status from the address, Đang bán by default", () => {
    expect(readPostStatus("withdrawn")).toBe("withdrawn");
    expect(readPostStatus("removed")).toBe("on_sale");
    expect(readPostStatus(null)).toBe("on_sale");
  });

  it("are counted by status", () => {
    expect(countPosts(offers)).toEqual({ on_sale: 2, sold_out: 1, closed: 0, withdrawn: 2 });
  });

  it("are listed newest first, a withdrawn one by when it was withdrawn", () => {
    expect(postsIn(offers, "on_sale").map((post) => post.id)).toEqual(["b", "a"]);
    expect(postsIn(offers, "withdrawn").map((post) => post.id)).toEqual(["d", "e"]);
  });

  it("lend their newest three photos to the cover", () => {
    expect(coverPhotos(offers)).toEqual([
      "/photos/ph-b/1600.jpg",
      "/photos/ph-a/1600.jpg",
      "/photos/ph-c/1600.jpg",
    ]);
    expect(coverPhotos([])).toEqual([]);
  });
});
