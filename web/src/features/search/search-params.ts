import {
  createLoader,
  createParser,
  createSerializer,
  parseAsNumberLiteral,
  parseAsStringLiteral,
} from "nuqs/server";

import { homeSearchParams } from "@/features/home/search-params";
import type { OfferSort } from "@/features/offers/list-offers";

/** The choices the search's chips offer (Figma K2 chip lọc), each one a value `GET /offers` takes. */
export const radiusChoices = [1, 2, 5] as const;
export const sortChoices = [
  "relevance",
  "distance",
  "ending_soon",
  "price",
  "discount",
] as const satisfies readonly OfferSort[];

/** No surplus dish costs more than this; a larger figure in the address is ignored. */
const PRICE_LIMIT = 10_000_000;
// A time of day on the 24-hour clock, "20:30".
const timeOfDay = /^([01]\d|2[0-3]):[0-5]\d$/;

/** A price of one portion in đồng, a whole number from 1đ to the limit. */
const parseAsPrice = createParser({
  parse: (value) => {
    const price = Number(value);
    return Number.isInteger(price) && price > 0 && price <= PRICE_LIMIT ? price : null;
  },
  serialize: (price: number) => String(price),
});

/** A time to collect tonight, "21:30". */
const parseAsTime = createParser({
  parse: (value) => (timeOfDay.test(value) ? value : null),
  serialize: (time: string) => time,
});

/**
 * What the search's address asks for (docs/guidelines/web.md › Lists and filters): the home's words, kind,
 * collect-now and place, and the chips' radius, price range, collection times and order. Each key is read on its
 * own here; the rules across keys are `readSearchQuery`'s.
 */
export const searchSearchParams = {
  ...homeSearchParams,
  radiusKm: parseAsNumberLiteral(radiusChoices),
  minPrice: parseAsPrice,
  maxPrice: parseAsPrice,
  from: parseAsTime,
  to: parseAsTime,
  sort: parseAsStringLiteral(sortChoices),
};

export const loadSearchSearchParams = createLoader(searchSearchParams);
export const serializeSearchSearchParams = createSerializer(searchSearchParams);
