import { defined, nullable } from "@/features/home/search-params";
import type { OfferKind } from "@/features/offers/offer";

import {
  loadSearchSearchParams,
  radiusChoices,
  serializeSearchSearchParams,
  sortChoices,
} from "./search-params";

export { radiusChoices, sortChoices };

/**
 * What the search's address asks for: the home's words, kind, collect-now and place, and the chips' radius, price
 * range, collection times and order.
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

/**
 * The search's query: each key as nuqs read it (`search-params.ts`), then the rules across keys. A range out of
 * order is dropped, a radius means something only around a place, and a range of times replaces collecting now.
 */
export function readSearchQuery(
  params: Record<string, string | string[] | undefined>,
): SearchQuery {
  const read = defined(loadSearchSearchParams(params));
  const price = inOrder(read.minPrice, read.maxPrice);
  const time = inOrder(read.from, read.to);
  return {
    q: read.q,
    kind: read.kind,
    now: time.from || time.to ? undefined : read.now,
    near: read.near,
    radiusKm: read.near ? read.radiusKm : undefined,
    minPrice: price.from,
    maxPrice: price.to,
    from: time.from,
    to: time.to,
    sort: read.sort,
  };
}

/** Both ends when they are in order, otherwise neither; one end alone is kept. */
function inOrder<T extends number | string>(from?: T, to?: T): { from?: T; to?: T } {
  return from !== undefined && to !== undefined && from > to ? {} : { from, to };
}

/** The search's address for a query, with `change` applied; an undefined value drops that key. */
export function searchHref(query: SearchQuery, change: Partial<SearchQuery> = {}): string {
  const merged: SearchQuery = { ...query, ...change };
  for (const key of Object.keys(change) as (keyof SearchQuery)[]) {
    if (change[key] === undefined) delete merged[key];
  }
  return `/search${serializeSearchSearchParams(nullable(merged))}`;
}
