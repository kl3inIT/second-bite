import type { OfferSort } from "@/features/offers/list-offers";
import type { OfferKind } from "@/features/offers/offer";
import { readHomeQuery } from "@/features/home/home-query";

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

/**
 * What the search's address asks for: the home's words, kind, collect-now and place, and the chips' radius, price range, collection times and order.
 */
export type SearchQuery = {
  q?: string;
  kind?: OfferKind;
  now?: boolean;
  near?: string;
  radiusKm?: (typeof radiusChoices)[number];
  /** The price of one portion from and to, in đồng. */
  minPrice?: number;
  maxPrice?: number;
  /** Collected from and to tonight, "20:00" and "21:30". */
  from?: string;
  to?: string;
  sort?: (typeof sortChoices)[number];
};

export function readSearchQuery(
  params: Record<string, string | string[] | undefined>,
): SearchQuery {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const pick = <T extends string | number>(choices: readonly T[], value: string | undefined) =>
    choices.find((choice) => String(choice) === value);
  const { q, kind, now, near } = readHomeQuery(params);
  const price = readRange(readPrice(first(params.minPrice)), readPrice(first(params.maxPrice)));
  const time = readRange(readTime(first(params.from)), readTime(first(params.to)));
  return {
    q,
    kind,
    // Collecting now and a range of times are one filter; the range wins.
    now: time.from || time.to ? undefined : now,
    near,
    // A radius only means something around a place.
    radiusKm: near ? pick(radiusChoices, first(params.radiusKm)) : undefined,
    minPrice: price.from,
    maxPrice: price.to,
    from: time.from,
    to: time.to,
    sort: pick(sortChoices, first(params.sort)),
  };
}

function readPrice(value: string | undefined): number | undefined {
  const price = Number(value);
  return value && Number.isInteger(price) && price > 0 && price <= PRICE_LIMIT ? price : undefined;
}

function readTime(value: string | undefined): string | undefined {
  return value && timeOfDay.test(value) ? value : undefined;
}

/** Both ends when they are in order, otherwise neither; one end alone is kept. */
function readRange<T extends number | string>(from?: T, to?: T): { from?: T; to?: T } {
  return from !== undefined && to !== undefined && from > to ? {} : { from, to };
}

/** The address's query for a search, with `change` applied; an undefined value drops that key. */
export function searchParams(
  query: SearchQuery,
  change: Partial<Record<keyof SearchQuery, string | number | boolean | undefined>> = {},
): Record<string, string> {
  const merged: Record<string, unknown> = { ...query, ...change };
  return Object.fromEntries(
    Object.entries(merged)
      .filter(([, value]) => value !== undefined && value !== false)
      .map(([key, value]) => [key, value === true ? "1" : String(value)]),
  );
}
