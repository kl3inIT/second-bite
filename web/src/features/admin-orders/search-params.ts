import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsIsoDate,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import type { OrderBody } from "@/lib/api/generated";

export type OrderStatus = OrderBody["status"];

/** The cards over the list (Figma AD-DH1): handed over, still to collect, and not come for. */
export const cardStates = ["collected", "waiting", "expired"] as const;

export type CardState = (typeof cardStates)[number];

/** The statuses each card lists: "Đang chờ nhận" holds the orders confirmed and those ready. */
export const statusesOf: Record<CardState, OrderStatus[]> = {
  collected: ["collected"],
  waiting: ["confirmed", "ready"],
  expired: ["expired"],
};

/** The rows a page may hold, as the "Số dòng" choice offers them. */
export const orderPageSizes = [10, 25, 50] as const;

/**
 * What every store's orders are filtered by, kept in the address (SEC-75 › Lists, `nuqs`): a card, words, a
 * store, a range of collection days, the page and its size. Absent, the list shows every order, the latest
 * window first, 10 a page as Figma AD-DH1 draws it.
 */
export const orderSearchParams = {
  state: parseAsStringLiteral(cardStates),
  q: parseAsString.withDefault(""),
  store: parseAsString,
  from: parseAsIsoDate,
  to: parseAsIsoDate,
  page: parseAsInteger.withDefault(1),
  size: parseAsNumberLiteral(orderPageSizes).withDefault(10),
};

export const loadOrderSearchParams = createLoader(orderSearchParams);
export const serializeOrderSearchParams = createSerializer(orderSearchParams);
