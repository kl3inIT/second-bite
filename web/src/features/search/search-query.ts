import type { OfferSort } from "@/features/offers/list-offers";
import type { OfferKind } from "@/features/offers/offer";
import { readHomeQuery } from "@/features/home/home-query";

/** The choices the search's chips offer (Figma K2 chip lọc), each one a value `GET /offers` takes. */
export const radiusChoices = [1, 2, 5] as const;
export const maxPriceChoices = [20_000, 30_000, 50_000] as const;
export const sortChoices = [
  "relevance",
  "distance",
  "ending_soon",
  "price",
  "discount",
] as const satisfies readonly OfferSort[];

/**
 * What the search's address asks for: the home's words, kind, collect-now and place, which tab is open
 * (`?tab=sellers`, dishes otherwise), and the chips' radius, highest price and order.
 */
export type SearchQuery = {
  q?: string;
  tab?: "sellers";
  kind?: OfferKind;
  now?: boolean;
  near?: string;
  radiusKm?: (typeof radiusChoices)[number];
  maxPrice?: (typeof maxPriceChoices)[number];
  sort?: (typeof sortChoices)[number];
};

export function readSearchQuery(
  params: Record<string, string | string[] | undefined>,
): SearchQuery {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const pick = <T extends string | number>(choices: readonly T[], value: string | undefined) =>
    choices.find((choice) => String(choice) === value);
  const { q, kind, now, near } = readHomeQuery(params);
  return {
    q,
    tab: first(params.tab) === "sellers" ? "sellers" : undefined,
    kind,
    now,
    near,
    // A radius only means something around a place.
    radiusKm: near ? pick(radiusChoices, first(params.radiusKm)) : undefined,
    maxPrice: pick(maxPriceChoices, first(params.maxPrice)),
    sort: pick(sortChoices, first(params.sort)),
  };
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
