import type { OfferBody } from "@/lib/api/generated";

import { plain, vietnamDay } from "./store-day";

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

/** The posts made today, Vietnam's time: the store home's "Bài đăng hôm nay". */
export function postedToday(offers: readonly OfferBody[]): OfferBody[] {
  const today = vietnamDay.format(new Date());
  return offers.filter((offer) => vietnamDay.format(new Date(offer.createdAt)) === today);
}

/** The posts collected on a day, Vietnam's time (`2026-10-21`): a post belongs to the day its window opens. */
export function offersOfDay(offers: readonly OfferBody[], day: string): OfferBody[] {
  return offers.filter((offer) => vietnamDay.format(new Date(offer.windowStart)) === day);
}

/** Whether a post answers a search by its name, without accents or case; an empty search answers every post. */
export function matchesName(offer: OfferBody, query: string): boolean {
  const wanted = plain(query.trim());
  return !wanted || plain(offer.name).includes(wanted);
}
