import type { LatestOfferBody, OpenedSellerBody } from "@/lib/api/generated";

/** One line of the recent activity (Figma AD-TQ1 › Hoạt động gần đây): a store opened, or a post went up. */
export type Activity =
  | { kind: "sellerOpened"; key: string; at: string; sellerId: string; sellerName: string }
  | {
      kind: "offerPosted";
      key: string;
      at: string;
      sellerId: string;
      sellerName: string;
      offerName: string;
    };

/**
 * The newest stores and posts of the summary in one list, newest first, cut to `limit`. These are the two kinds
 * of activity the backend records today; orders and problem reports join them when their modules exist.
 */
export function mergeActivity(
  sellers: OpenedSellerBody[],
  offers: LatestOfferBody[],
  limit: number,
): Activity[] {
  const opened = sellers.map((seller): Activity => ({
    kind: "sellerOpened",
    key: `seller-${seller.id}`,
    at: seller.openedAt,
    sellerId: seller.id,
    sellerName: seller.name,
  }));
  const posted = offers.map((offer): Activity => ({
    kind: "offerPosted",
    key: `offer-${offer.id}`,
    at: offer.postedAt,
    sellerId: offer.sellerId,
    sellerName: offer.sellerName,
    offerName: offer.name,
  }));
  return [...opened, ...posted].sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, limit);
}
