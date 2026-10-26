"use client";

import { LayoutGridIcon, ListIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { stored } from "@/lib/stored";
import { cn } from "@/lib/utils";

// How the search lays out its results (Figma K2 "kiểu xem", as Careem switches them): a grid of cards, or a list
// grouped by seller with a row for each dish. The choice is kept in this browser; the server and a first visit
// show the grid.
const views = ["grid", "list"] as const;
type View = (typeof views)[number];
const chosen = stored<View>("secondbite.search-view", z.enum(views), "grid");
const icons = { grid: LayoutGridIcon, list: ListIcon } as const;

/** The results in the chosen view; only that one is drawn. */
export function SearchView({ grid, list }: { grid: React.ReactNode; list: React.ReactNode }) {
  return chosen.useValue() === "list" ? list : grid;
}

/**
 * The two buttons at the end of the summary line (Figma K2, WK2): 20px icons, the chosen one in the brand's
 * colour. Each button is a 44px target, so the row reaches past the line and the column's edge by the margin
 * around the icon.
 */
export function ViewSwitch() {
  const t = useTranslations("Search");
  const current = chosen.useValue();

  return (
    <div className="-my-3 -mr-3 flex shrink-0">
      {views.map((view) => {
        const Icon = icons[view];
        return (
          <button
            key={view}
            type="button"
            aria-pressed={view === current}
            aria-label={t(`view.${view}`)}
            onClick={() => chosen.save(view)}
            className={cn(
              "flex size-11 items-center justify-center rounded-lg focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
              view === current ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon aria-hidden className="size-5" />
          </button>
        );
      })}
    </div>
  );
}
