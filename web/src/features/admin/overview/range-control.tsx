"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useOptimistic, useTransition } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePathname, useRouter } from "@/i18n/navigation";

import { type OverviewRange, overviewRanges, readOverviewRange } from "./overview-range";

/**
 * The dashboard's span in the address (`?range=7d`), so a reload or a shared link keeps it; today, the default,
 * leaves the address bare. Changing it renders the page again on the server with the new span.
 */
function useOverviewRange() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  // The chosen span shows at once, while the server renders its figures.
  const [range, setShown] = useOptimistic(readOverviewRange(params.get("range")));

  const setRange = (next: OverviewRange) => {
    const query = Object.fromEntries(params.entries());
    if (next === "today") delete query.range;
    else query.range = next;
    startTransition(() => {
      setShown(next);
      router.replace({ pathname, query }, { scroll: false });
    });
  };

  return { range, setRange };
}

/** Hôm nay | 7 ngày | 30 ngày at the right of the heading (Figma AD-TQ1 › Admin/SegmentedControl). */
export function RangeControl() {
  const t = useTranslations("admin.overview.range");
  const { range, setRange } = useOverviewRange();

  return (
    <ToggleGroup
      aria-label={t("label")}
      variant="outline"
      value={[range]}
      // One span is always chosen: pressing the chosen one again keeps it.
      onValueChange={(next) => {
        const chosen = next.find((value) => value !== range) ?? next[0];
        if (chosen) setRange(readOverviewRange(chosen));
      }}
    >
      {overviewRanges.map((value) => (
        <ToggleGroupItem key={value} value={value}>
          {t(value)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
