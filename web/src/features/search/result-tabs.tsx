import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { searchParams, type SearchQuery } from "./search-query";

// Dishes or sellers (Figma K2 tab Món / Quán): two halves, the open one in Tasco blue over a 3px line, each a
// link over the address with how many it holds.
export function ResultTabs({
  query,
  dishes,
  sellers,
}: {
  query: SearchQuery;
  dishes: number;
  sellers: number;
}) {
  const t = useTranslations("Search");
  const tabs = [
    { key: "dishes", label: t("dishesTab", { count: dishes }), tab: undefined },
    { key: "sellers", label: t("sellersTab", { count: sellers }), tab: "sellers" },
  ] as const;

  return (
    <nav aria-label={t("tabs")} className="px-4">
      <ul className="grid grid-cols-2 border-b border-border">
        {tabs.map(({ key, label, tab }) => {
          const current = query.tab === tab;
          return (
            <li key={key} className="flex">
              <Link
                href={{ pathname: "/search", query: searchParams(query, { tab }) }}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "-mb-px flex min-h-11 flex-1 items-center justify-center border-b-3 text-title transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-inset",
                  current
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
