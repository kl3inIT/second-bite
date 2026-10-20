import type { OfferBody } from "@/lib/api/generated";

/**
 * The tabs of a store's post list (Figma Q2, S1, S2): what is on sale, what has sold out, and what is over,
 * which holds both the posts whose window has closed and the withdrawn ones. "Dự kiến" (Figma Q2c) joins when
 * the backend has announcements (SEC-54).
 */
export const postTabs = ["on_sale", "sold_out", "closed"] as const;

export type PostTab = (typeof postTabs)[number];

export function readPostTab(value: string | undefined): PostTab {
  return postTabs.find((tab) => tab === value) ?? "on_sale";
}

export function tabOf(offer: OfferBody): PostTab {
  switch (offer.status) {
    case "on_sale":
      return "on_sale";
    case "sold_out":
      return "sold_out";
    default:
      return "closed";
  }
}

/** The posts of each tab, in the backend's order (the newest first), and how many each holds. */
export function groupByTab(offers: readonly OfferBody[]): Record<PostTab, OfferBody[]> {
  const groups: Record<PostTab, OfferBody[]> = { on_sale: [], sold_out: [], closed: [] };
  for (const offer of offers) groups[tabOf(offer)].push(offer);
  return groups;
}

/** A day as `2026-10-20` in Vietnam's time, to tell whether two moments fall on the same day there. */
const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });

/** The posts made today, Vietnam's time: the store home's "Bài đăng hôm nay". */
export function postedToday(offers: readonly OfferBody[]): OfferBody[] {
  const today = day.format(new Date());
  return offers.filter((offer) => day.format(new Date(offer.createdAt)) === today);
}
