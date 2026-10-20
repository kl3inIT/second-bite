import { useFormatter, useTranslations } from "next-intl";

import { formatPrice } from "@/features/offers/format";
import { offerKinds } from "@/features/offers/offer";

import { FilterMenu, type FilterOption } from "./filter-menu";
import {
  maxPriceChoices,
  radiusChoices,
  searchParams,
  sortChoices,
  type SearchQuery,
} from "./search-query";

// The search's chips (Figma K2 chip lọc), each a filter `GET /offers` takes: how far around the person's
// place (only with one), the highest price, collectable now, and the kind. Choosing one keeps the others.
export function SearchFilters({ query }: { query: SearchQuery }) {
  const t = useTranslations("Search");
  const kinds = useTranslations("OfferKind");
  const format = useFormatter();
  const option = (
    label: string,
    change: Parameters<typeof searchParams>[1],
    current: boolean,
  ): FilterOption => ({ label, query: searchParams(query, change), current });

  return (
    <ul aria-label={t("filters")} className="flex gap-2 overflow-x-auto px-4 py-1.25">
      {query.near && (
        <li>
          <FilterMenu
            variant="chip"
            name={t("distance")}
            options={[
              option(t("anyDistance"), { radiusKm: undefined }, !query.radiusKm),
              ...radiusChoices.map((km) =>
                option(
                  t("within", { distance: format.number(km, "kilometers") }),
                  { radiusKm: km },
                  query.radiusKm === km,
                ),
              ),
            ]}
          />
        </li>
      )}
      <li>
        <FilterMenu
          variant="chip"
          name={t("price")}
          options={[
            option(t("anyPrice"), { maxPrice: undefined }, !query.maxPrice),
            ...maxPriceChoices.map((price) =>
              option(
                t("under", { price: formatPrice(price) }),
                { maxPrice: price },
                query.maxPrice === price,
              ),
            ),
          ]}
        />
      </li>
      <li>
        <FilterMenu
          variant="chip"
          name={t("when")}
          options={[
            option(t("anyTime"), { now: undefined }, !query.now),
            option(t("now"), { now: true }, Boolean(query.now)),
          ]}
        />
      </li>
      <li>
        <FilterMenu
          variant="chip"
          name={t("kind")}
          options={[
            option(t("anyKind"), { kind: undefined }, !query.kind),
            ...offerKinds.map((kind) => option(kinds(kind), { kind }, query.kind === kind)),
          ]}
        />
      </li>
    </ul>
  );
}

/** The order of the results ("Gần nhất ▾"): the backend's own first, then each other one it takes. */
export function SearchOrder({ query }: { query: SearchQuery }) {
  const t = useTranslations("Search");
  const natural = query.q ? "relevance" : query.near ? "distance" : "ending_soon";
  const others = sortChoices.filter(
    (sort) =>
      sort !== natural && (sort !== "relevance" || query.q) && (sort !== "distance" || query.near),
  );

  return (
    <FilterMenu
      variant="inline"
      name={t(`sort.${natural}`)}
      options={[
        {
          label: t(`sort.${natural}`),
          query: searchParams(query, { sort: undefined }),
          current: !query.sort,
        },
        ...others.map((sort) => ({
          label: t(`sort.${sort}`),
          query: searchParams(query, { sort }),
          current: query.sort === sort,
        })),
      ]}
    />
  );
}
