import { useFormatter, useTranslations } from "next-intl";

import { formatPrice } from "@/features/offers/format";
import { offerKinds } from "@/features/offers/offer";

import { FilterMenu, type FilterOption } from "./filter-menu";
import { RangeFilter } from "./range-filter";
import { radiusChoices, searchParams, sortChoices, type SearchQuery } from "./search-query";

// The search's chips (Figma K2 chip lọc), each a filter `GET /offers` takes: how far around the person's
// place (only with one), the price from and to, the time to collect from and to (or now), and the kind.
// Choosing one keeps the others.
// The home shows them over "Tất cả món quanh đây" (Figma K1b), `raised` on its sky ground, with the order
// as a chip and `before` them a link to the search; each choice opens the search.
export function SearchFilters({
  query,
  raised,
  before,
}: {
  query: SearchQuery;
  raised?: boolean;
  before?: React.ReactNode;
}) {
  const t = useTranslations("Search");
  const kinds = useTranslations("OfferKind");
  const format = useFormatter();
  const option = (
    label: string,
    change: Parameters<typeof searchParams>[1],
    current: boolean,
  ): FilterOption => ({ label, query: searchParams(query, change), current });
  const range = (from?: string, to?: string) =>
    from && to
      ? t("range", { from, to })
      : from
        ? t("rangeFrom", { from })
        : to
          ? t("rangeTo", { to })
          : undefined;
  const timeKeep = searchParams(query, { from: undefined, to: undefined, now: undefined });

  return (
    <ul
      aria-label={t("filters")}
      className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-1.25 *:shrink-0"
    >
      {before && <li>{before}</li>}
      {raised && (
        <li>
          <SearchOrder query={query} chip />
        </li>
      )}
      {query.near && (
        <li>
          <FilterMenu
            variant="chip"
            raised={raised}
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
        <RangeFilter
          type="price"
          raised={raised}
          name={t("price")}
          chosen={range(
            query.minPrice ? formatPrice(query.minPrice) : undefined,
            query.maxPrice ? formatPrice(query.maxPrice) : undefined,
          )}
          from={query.minPrice?.toString()}
          to={query.maxPrice?.toString()}
          keep={searchParams(query, { minPrice: undefined, maxPrice: undefined })}
          params={["minPrice", "maxPrice"]}
        />
      </li>
      <li>
        <RangeFilter
          type="time"
          raised={raised}
          name={t("when")}
          chosen={query.now ? t("now") : range(query.from, query.to)}
          from={query.from}
          to={query.to}
          keep={timeKeep}
          params={["from", "to"]}
          now={{ query: { ...timeKeep, now: "1" }, current: Boolean(query.now) }}
        />
      </li>
      <li>
        <FilterMenu
          variant="chip"
          raised={raised}
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

/**
 * The order of the results ("Gần nhất ▾"): the backend's own first, then each other one it takes. As a
 * `chip` it is the home's "Sắp xếp ▾".
 */
export function SearchOrder({ query, chip = false }: { query: SearchQuery; chip?: boolean }) {
  const t = useTranslations("Search");
  const natural = query.q ? "relevance" : query.near ? "distance" : "ending_soon";
  const others = sortChoices.filter(
    (sort) =>
      sort !== natural && (sort !== "relevance" || query.q) && (sort !== "distance" || query.near),
  );

  return (
    <FilterMenu
      variant={chip ? "chip" : "inline"}
      raised={chip}
      name={chip ? t("sortBy") : t(`sort.${natural}`)}
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
