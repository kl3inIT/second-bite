"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { dateToDay, dayToDate } from "@/features/admin/overview/days";
import { type DateRangeValue, DateRangeFilter, FilterSelect } from "@/features/admin/ui/filter-bar";
import { usePathname, useRouter } from "@/i18n/navigation";

import { ExportDialog } from "./export-dialog";
import type { ReportQuery } from "./report-query";

/** "All" in the store filter: no `?seller=`. */
const allSellers = "all";

/**
 * The report's filters in the address (`?from=&to=&seller=`), so a reload or a shared link keeps them. A range
 * half chosen in the calendar waits in the browser until its last day is picked; clearing it goes back to the
 * default 30 days.
 */
function useReportFilters(query: ReportQuery) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [draft, setDraft] = useState<DateRangeValue | null>(null);

  const go = (next: { from?: string; to?: string; seller?: string }) => {
    const params = Object.fromEntries(
      Object.entries(next).filter((entry): entry is [string, string] => Boolean(entry[1])),
    );
    startTransition(() => router.replace({ pathname, query: params }, { scroll: false }));
  };

  const range: DateRangeValue = draft ?? { from: dayToDate(query.from), to: dayToDate(query.to) };

  const setRange = (value: DateRangeValue) => {
    if (value.from && value.to) {
      setDraft(null);
      go({ from: dateToDay(value.from), to: dateToDay(value.to), seller: query.sellerId });
    } else if (!value.from) {
      setDraft(null);
      go({ seller: query.sellerId });
    } else {
      setDraft(value);
    }
  };

  const setSeller = (seller: string) =>
    go({ from: query.from, to: query.to, seller: seller === allSellers ? undefined : seller });

  return { range, setRange, seller: query.sellerId ?? allSellers, setSeller };
}

/**
 * The report's controls beside its heading (Figma AD-BC1 › Actions): the range, the store, and "Xuất báo cáo",
 * which opens the export (AD-BC2).
 */
export function ReportActions({
  query,
  sellers,
  sellerCount,
}: {
  query: ReportQuery;
  sellers: { value: string; label: string }[];
  sellerCount: number;
}) {
  const t = useTranslations("admin.reports.filters");
  const { range, setRange, seller, setSeller } = useReportFilters(query);
  const [exporting, setExporting] = useState(false);

  return (
    <>
      <DateRangeFilter label={t("range")} value={range} onChange={setRange} />
      <FilterSelect
        label={t("seller")}
        value={seller}
        options={[
          { value: allSellers, label: t("allSellers", { count: sellerCount }) },
          ...sellers,
        ]}
        onChange={setSeller}
      />
      <Button onClick={() => setExporting(true)}>{t("export")}</Button>
      <ExportDialog open={exporting} onOpenChange={setExporting} range={query} />
    </>
  );
}
