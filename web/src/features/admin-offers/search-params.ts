import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsIsoDate,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import type { OfferBody } from "@/lib/api/generated";

export type OfferStatus = OfferBody["status"];

/** The cards over the list, each a status it filters by (Figma AD-BD1). */
export const cardStatuses = [
  "on_sale",
  "sold_out",
  "closed",
  "withdrawn",
] as const satisfies readonly OfferStatus[];

/** The rows a page may hold, as the "Số dòng" choice offers them. */
export const offerPageSizes = [10, 25, 50] as const;

/**
 * What every store's posts are filtered by, kept in the address (SEC-75 › Lists, `nuqs`): a status, words, a
 * store, a range of days posted, the page and its size. Absent, the list shows every post, newest first, 10 a
 * page as Figma AD-BD1 draws it.
 */
export const offerSearchParams = {
  status: parseAsStringLiteral(cardStatuses),
  q: parseAsString.withDefault(""),
  store: parseAsString,
  from: parseAsIsoDate,
  to: parseAsIsoDate,
  page: parseAsInteger.withDefault(1),
  size: parseAsNumberLiteral(offerPageSizes).withDefault(10),
};

export const loadOfferSearchParams = createLoader(offerSearchParams);
export const serializeOfferSearchParams = createSerializer(offerSearchParams);
