import {
  createLoader,
  createParser,
  createSerializer,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

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

/** The day the store's home shows. */
export const homeSearchParams = { day: parseAsDay };

export const loadOrderSearchParams = createLoader(orderSearchParams);
export const loadPostSearchParams = createLoader(postSearchParams);
export const loadHomeSearchParams = createLoader(homeSearchParams);

/** The lists that show a day, each with its own address. */
export const listSearchParams = {
  orders: orderSearchParams,
  posts: postSearchParams,
  home: homeSearchParams,
};

export type DayList = keyof typeof listSearchParams;

export const serializeOrderSearchParams = createSerializer(orderSearchParams);
export const serializePostSearchParams = createSerializer(postSearchParams);

/** The day for an address: none for today, which is where a list opens. */
export function dayOrNull(day: string, today: string): string | null {
  return day === today ? null : day;
}

/** The words searched, as the lists read them: trimmed, at most 80 characters. */
export function searchOf(q: string): string {
  return q.trim().slice(0, 80);
}
