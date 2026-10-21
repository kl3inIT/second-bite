"use client";

import { enUS, vi } from "date-fns/locale";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useId, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dateToDay, dayToDate } from "@/features/admin/overview/days";
import { usePathname, useRouter } from "@/i18n/navigation";

import { ExportDialog } from "./export-dialog";
import { type DayRange, type ReportQuery, rangeText } from "./report-query";

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
  const [draft, setDraft] = useState<DayRange | null>(null);

  const go = (next: { from?: string; to?: string; seller?: string }) => {
    const params = Object.fromEntries(
      Object.entries(next).filter((entry): entry is [string, string] => Boolean(entry[1])),
    );
    startTransition(() => router.replace({ pathname, query: params }, { scroll: false }));
  };

  const range: DayRange = draft ?? { from: dayToDate(query.from), to: dayToDate(query.to) };

  const setRange = (value: DayRange) => {
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
  const tShell = useTranslations("admin.shell.dateRange");
  const format = useFormatter();
  const locale = useLocale();
  const id = useId();
  const { range, setRange, seller, setSeller } = useReportFilters(query);
  const [exporting, setExporting] = useState(false);
  const options = [
    { value: allSellers, label: t("allSellers", { count: sellerCount }) },
    ...sellers,
  ];

  return (
    <>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          <CalendarIcon data-icon="inline-start" aria-hidden />
          <span className="text-muted-foreground">{t("range")}:</span>
          <span className="text-body-sm-strong text-foreground">
            {rangeText(range, locale, (at) => format.dateTime(at, "day")) ?? tShell("any")}
          </span>
          <ChevronDownIcon data-icon="inline-end" aria-hidden />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto">
          <Calendar
            mode="range"
            locale={locale === "vi" ? vi : enUS}
            numberOfMonths={2}
            selected={{ from: range.from, to: range.to }}
            onSelect={(next) => setRange({ from: next?.from, to: next?.to })}
          />
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setRange({})}>
              {tShell("clear")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Select
        value={seller}
        items={options}
        onValueChange={(next) => {
          if (typeof next === "string") setSeller(next);
        }}
      >
        <SelectTrigger aria-labelledby={`${id}-seller`}>
          <span id={`${id}-seller`} className="text-muted-foreground">
            {t("seller")}:
          </span>
          <span className="text-body-sm-strong text-foreground">
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align="start">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={() => setExporting(true)}>{t("export")}</Button>
      <ExportDialog open={exporting} onOpenChange={setExporting} range={query} />
    </>
  );
}
