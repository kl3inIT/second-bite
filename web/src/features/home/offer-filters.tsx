import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { offerKinds, type OfferKind } from "@/features/offers/offer";
import { Link } from "@/i18n/navigation";

import type { HomeQuery } from "./home-query";

// The search field and the filter chips of the home (Figma Search, Filters). Both are plain links
// and a GET form over the address, so a filtered list can be shared and works before JavaScript.
export function OfferFilters({ query }: { query: HomeQuery }) {
  const t = useTranslations("Home");
  const kinds = useTranslations("OfferKind");
  const chips: { key: string; label: string; href: HomeQuery; active: boolean }[] = [
    { key: "all", label: t("all"), href: {}, active: !query.kind && !query.now },
    { key: "now", label: t("collectNow"), href: { now: true }, active: !!query.now },
    ...offerKinds.map((kind: OfferKind) => ({
      key: kind,
      label: kinds(kind),
      href: { kind },
      active: query.kind === kind,
    })),
  ];

  return (
    <div className="flex flex-col gap-3">
      <search>
        <form className="relative">
          <label htmlFor="offer-search" className="sr-only">
            {t("searchLabel")}
          </label>
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-3 left-4 size-5 text-muted-foreground"
          />
          <input
            id="offer-search"
            name="q"
            type="search"
            defaultValue={query.q}
            placeholder={t("searchPlaceholder")}
            className="h-12 w-full rounded-full border border-input bg-card pr-4 pl-12 text-body text-card-foreground placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
        </form>
      </search>
      <nav aria-label={t("filtersLabel")} className="-mx-4 overflow-x-auto px-4">
        <ul className="flex w-max gap-2">
          {chips.map((chip) => (
            <li key={chip.key}>
              <Link
                href={{ pathname: "/", query: toSearch(chip.href) }}
                aria-current={chip.active ? "page" : undefined}
                className={
                  chip.active
                    ? "inline-flex h-11 items-center rounded-full bg-primary px-4 text-body-sm-strong text-primary-foreground"
                    : "inline-flex h-11 items-center rounded-full bg-card px-4 text-body-sm-strong text-card-foreground hover:bg-secondary"
                }
              >
                {chip.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function toSearch(query: HomeQuery): Record<string, string> {
  return {
    ...(query.kind ? { kind: query.kind } : {}),
    ...(query.now ? { now: "1" } : {}),
  };
}
