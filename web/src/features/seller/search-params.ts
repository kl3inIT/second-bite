import {
  createLoader,
  createParser,
  createSerializer,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import { sellerTabs } from "@/features/admin-sellers/search-params";

import { readDay } from "./store-day";
import { postTabs } from "./store-offers";
import { orderTabs } from "./store-orders";

/**
 * A day of a store's lists, `2026-10-21`; one that is no real day reads as none. None is today, which the page
 * knows only at request time, so it is no default here: the page reads `day ?? today`, and a link to today
 * leaves the day out (`dayOrNull`).
 */
const parseAsDay = createParser({
  parse: (value) => readDay(value, "") || null,
  serialize: (day: string) => day,
});

/** The words a list is searched by, as long as the field takes them. */
const parseAsSearch = parseAsString.withDefault("");

/**
 * What a store's order list shows, kept in the address (docs/guidelines/web.md › Lists and filters): the day, the
 * tab (being prepared first) and the words searched. A value as the list opens stays out of the address.
 */
export const orderSearchParams = {
  day: parseAsDay,
  tab: parseAsStringLiteral(orderTabs).withDefault("preparing"),
  q: parseAsSearch,
};

/** What a store's post list shows: the day, the tab (on sale first) and the words searched. */
export const postSearchParams = {
  day: parseAsDay,
  tab: parseAsStringLiteral(postTabs).withDefault("on_sale"),
  q: parseAsSearch,
};

/** The day the store's home shows, and the group of its orders listed (being prepared first, SEC-124). */
export const homeSearchParams = {
  day: parseAsDay,
  tab: parseAsStringLiteral(orderTabs).withDefault("preparing"),
};

/** The day of a store's orders on the admin's page of it (Figma AD-QD6), and the page's tab, overview first. */
export const adminStoreSearchParams = {
  day: parseAsDay,
  tab: parseAsStringLiteral(sellerTabs).withDefault("overview"),
};

export const loadOrderSearchParams = createLoader(orderSearchParams);
export const loadPostSearchParams = createLoader(postSearchParams);
export const loadHomeSearchParams = createLoader(homeSearchParams);
export const loadAdminStoreSearchParams = createLoader(adminStoreSearchParams);

/** The lists that show a day, each with its own address. */
export const listSearchParams = {
  orders: orderSearchParams,
  posts: postSearchParams,
  home: homeSearchParams,
  adminStore: adminStoreSearchParams,
};

export type DayList = keyof typeof listSearchParams;

export const serializeOrderSearchParams = createSerializer(orderSearchParams);
export const serializePostSearchParams = createSerializer(postSearchParams);
export const serializeHomeSearchParams = createSerializer(homeSearchParams);

/** The day for an address: none for today, which is where a list opens. */
export function dayOrNull(day: string, today: string): string | null {
  return day === today ? null : day;
}

/** The words searched, as the lists read them: trimmed, at most 80 characters. */
export function searchOf(q: string): string {
  return q.trim().slice(0, 80);
}
