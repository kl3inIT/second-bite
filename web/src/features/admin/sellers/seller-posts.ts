import type { OfferBody } from "@/lib/api/generated";

/**
 * The statuses of a store's posts, as the Bài đăng tab filters them (Figma AD-QD1, AD-QD2): on sale, sold out,
 * over, and withdrawn by the store ("Đã gỡ"). An admin's removal for a violation is a status of its own that
 * the backend does not have yet ("Gỡ do vi phạm").
 */
export const postStatuses = ["on_sale", "sold_out", "closed", "withdrawn"] as const;
export type PostStatus = (typeof postStatuses)[number];

/** The status the address asks for, Đang bán when it names none or one that does not exist. */
export function readPostStatus(value: string | null | undefined): PostStatus {
  return postStatuses.find((status) => status === value) ?? "on_sale";
}

/** How many posts each status holds. */
export function countPosts(offers: readonly OfferBody[]): Record<PostStatus, number> {
  const counts: Record<PostStatus, number> = { on_sale: 0, sold_out: 0, closed: 0, withdrawn: 0 };
  for (const offer of offers) counts[offer.status] += 1;
  return counts;
}

/** When a post took its place in its list: when it was withdrawn for "Đã gỡ", when it was posted otherwise. */
export function postedAt(offer: OfferBody): string {
  return offer.status === "withdrawn" && offer.withdrawnAt ? offer.withdrawnAt : offer.createdAt;
}

/** The posts of one status, the newest first. */
export function postsIn(offers: readonly OfferBody[], status: PostStatus): OfferBody[] {
  return offers
    .filter((offer) => offer.status === status)
    .toSorted((a, b) => Date.parse(postedAt(b)) - Date.parse(postedAt(a)));
}

/**
 * The photos across the top of a store's page (Figma Admin/DetailHeader "Cover · 3 ảnh"): its newest posts'
 * photos, one each, at most three. A store without posts has none and the band stays its plain colour.
 */
export function coverPhotos(offers: readonly OfferBody[]): string[] {
  const paths = new Set<string>();
  for (const offer of offers.toSorted(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  )) {
    paths.add(offer.photo.largePath);
    if (paths.size === 3) break;
  }
  return [...paths];
}
