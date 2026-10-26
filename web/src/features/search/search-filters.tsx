import { useFormatter, useTranslations } from "next-intl";

import { formatPrice } from "@/features/offers/format";
import { offerKinds } from "@/features/offers/offer";
import { cn } from "@/lib/utils";

import { FilterMenu, type FilterOption } from "./filter-menu";
import { RangeFilter, type RangePreset } from "./range-filter";
import { radiusChoices, searchHref, sortChoices, type SearchQuery } from "./search-query";

// The search's chips (Figma K2 chip lọc), each a filter `GET /offers` takes: how far around the person's
// place (only with one), the price from and to, the time to collect from and to (or now), and the kind.
// Choosing one keeps the others.
// `raised` sets them on the sky ground and `sort` puts the order first, as Keeta and foodpanda do (Figma K2). The
// home shows them over "Tất cả món quanh đây" (Figma K1b) with `before` them a link to the search; each choice
// opens the search.
export function SearchFilters({
  query,
  raised,
  sort,
  before,
  className,
}: {
  query: SearchQuery;
  raised?: boolean;
  sort?: boolean;
  before?: React.ReactNode;
  className?: string;
}) {
  const t = useTranslations("Search");
  const kinds = useTranslations("OfferKind");
  const format = useFormatter();
  const option = (label: string, change: Partial<SearchQuery>, current: boolean): FilterOption => ({
    label,
    href: searchHref(query, change),
    current,
  });
  const range = (from?: string, to?: string) =>
    from && to
      ? t("range", { from, to })
      : from
        ? t("rangeFrom", { from })
        : to
          ? t("rangeTo", { to })
          : undefined;
  const priceKeep: SearchQuery = { ...query, minPrice: undefined, maxPrice: undefined };
  const timeKeep: SearchQuery = { ...query, from: undefined, to: undefined, now: undefined };
  // Quick choices: a range in one press (Shopee's price steps, Too Good To Go's pickup windows).
  const pricePreset = (minPrice?: number, maxPrice?: number): RangePreset => ({
    label:
      range(
        minPrice ? formatPrice(minPrice) : undefined,
        maxPrice ? formatPrice(maxPrice) : undefined,
      ) ?? "",
    href: searchHref(priceKeep, { minPrice, maxPrice }),
    current: query.minPrice === minPrice && query.maxPrice === maxPrice,
  });
  const timePreset = (from?: string, to?: string): RangePreset => ({
    label: range(from, to) ?? "",
    href: searchHref(timeKeep, { from, to }),
    current: query.from === from && query.to === to,
  });

  return (
    <ul
      aria-label={t("filters")}
      className={cn("scrollbar-none flex gap-2 overflow-x-auto px-4 py-1.25 *:shrink-0", className)}
    >
      {before && <li>{before}</li>}
      {sort && (
        <li>
          <SearchOrder query={query} raised={raised} />
        </li>
      )}
      {query.near && (
        <li>
          <FilterMenu
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
          keep={priceKeep}
          params={["minPrice", "maxPrice"]}
          presets={[
            pricePreset(undefined, 20_000),
            pricePreset(20_000, 40_000),
            pricePreset(40_000, undefined),
          ]}
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
          presets={[
            {
              label: t("now"),
              href: searchHref(timeKeep, { now: true }),
              current: Boolean(query.now),
            },
            timePreset(undefined, "21:00"),
            timePreset("21:00", "22:00"),
            timePreset("22:00", undefined),
          ]}
        />
      </li>
      <li>
        <FilterMenu
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

/** The order of the results ("Sắp xếp ▾"): the backend's own first, then each other one it takes. */
function SearchOrder({ query, raised }: { query: SearchQuery; raised?: boolean }) {
  const t = useTranslations("Search");
  const natural = query.q ? "relevance" : query.near ? "distance" : "ending_soon";
  const others = sortChoices.filter(
    (sort) =>
      sort !== natural && (sort !== "relevance" || query.q) && (sort !== "distance" || query.near),
  );

  return (
    <FilterMenu
      raised={raised}
      name={t("sortBy")}
      options={[
        {
          label: t(`sort.${natural}`),
          href: searchHref(query, { sort: undefined }),
          current: !query.sort,
        },
        ...others.map((sort) => ({
          label: t(`sort.${sort}`),
          href: searchHref(query, { sort }),
          current: query.sort === sort,
        })),
      ]}
    />
  );
}
