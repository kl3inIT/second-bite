import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import type { PromotionBody } from "@/lib/api/generated";

export type PromotionStatus = PromotionBody["status"];

/** The cards over the list: running, scheduled and ended; a paused promotion is listed with its badge. */
export const cardStatuses = ["running", "scheduled", "ended"] as const satisfies PromotionStatus[];

/** The rows a page may hold, as the "Số dòng" choice offers them. */
export const promotionPageSizes = [10, 25, 50] as const;

/**
 * What the promotions are filtered by, kept in the address (web guideline › Lists): a status, words of the name, a
 * store, the page and its size. Absent, every promotion shows, the latest start first.
 */
export const promotionSearchParams = {
  status: parseAsStringLiteral(["running", "scheduled", "paused", "ended"] as const),
  q: parseAsString.withDefault(""),
  store: parseAsString,
  page: parseAsInteger.withDefault(1),
  size: parseAsNumberLiteral(promotionPageSizes).withDefault(10),
};

export const loadPromotionSearchParams = createLoader(promotionSearchParams);
export const serializePromotionSearchParams = createSerializer(promotionSearchParams);

/** The week the payouts show, by its Monday; this week's when absent, which the page knows at request time. */
export const payoutSearchParams = {
  week: parseAsString,
  promotion: parseAsString,
};

export const loadPayoutSearchParams = createLoader(payoutSearchParams);
