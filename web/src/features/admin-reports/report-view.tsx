"use client";

import { DownloadIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo, useTransition } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { buttonVariants } from "@/components/ui/button";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DataTable,
  SortHeader,
  type DataTableColumns,
  type Sorted,
} from "@/features/admin/data-table";
import { DayRange } from "@/features/admin/day-range";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import type { CountsBody, ReportOutputBody, ReportStoreBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import { reportSearchParams, type ReportSort } from "./search-params";

const anyStore = "all";

const linkLook =
  "hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

/** The share of orders collected, in whole percent; none without orders. */
function shareOf(c: CountsBody): number | null {
  return c.held > 0 ? Math.round((c.collected * 100) / c.held) : null;
}

function sortValue(store: ReportStoreBody, sort: ReportSort): number | string {
  if (sort === "name") return store.name;
  if (sort === "share") return shareOf(store.counts) ?? -1;
  return store.counts[sort];
}

/**
 * The prototype's numbers (SEC-80): the days and a store in the address, the totals as cards, the orders held
 * and collected per day as bars (NN/g: length for quantities), and a row per store, sorted in the browser by
 * any column as the stores are few. "Xuất CSV" downloads the same numbers per day and store from the server.
 */
export function ReportView({
  report,
  stores,
  exportHref,
}: {
  report: ReportOutputBody;
  stores: Array<{ id: string; name: string }>;
  exportHref: string;
}) {
  const t = useTranslations("Admin.reports");
  const [pending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(reportSearchParams, {
    shallow: false,
    startTransition,
  });
  const columns = useColumns(params.sort, params.dir, (sort, dir) => void setParams({ sort, dir }));
  const rows = useMemo(() => {
    const all = report.stores ?? [];
    if (!params.sort) return all;
    const sort = params.sort;
    const sign = params.dir === "descending" ? -1 : 1;
    return [...all].sort((a, b) => {
      const x = sortValue(a, sort);
      const y = sortValue(b, sort);
      return sign * (typeof x === "string" ? x.localeCompare(String(y), "vi") : x - Number(y));
    });
  }, [report.stores, params.sort, params.dir]);

  return (
    <section aria-label={t("title")} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <DayRange
          label={t("days")}
          anytime={t("lastWeek")}
          from={params.from}
          to={params.to}
          onChange={(from, to) => void setParams({ from, to })}
        />
        <Select
          value={params.store ?? anyStore}
          items={[
            { value: anyStore, label: t("anyStore") },
            ...stores.map((s) => ({ value: s.id, label: s.name })),
          ]}
          onValueChange={(store) => void setParams({ store: store === anyStore ? null : store })}
        >
          <SelectTrigger size="lg" aria-label={t("store")}>
            <span className="text-muted-foreground">{t("store")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={anyStore}>{t("anyStore")}</SelectItem>
              {stores.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* A plain download: the server answers the file and its name, under the session's cookie. */}
        <a href={exportHref} download className={cn(buttonVariants({ size: "lg" }), "sm:ms-auto")}>
          <DownloadIcon data-icon="inline-start" />
          {t("export")}
        </a>
      </div>
      <Cards totals={report.totals} />
      <DayBars days={report.days ?? []} />
      <DataTable
        label={t("table")}
        columns={columns}
        rows={rows}
        rowKey={(store) => store.sellerId}
        busy={pending}
        sorted={params.sort ? { column: params.sort, direction: params.dir ?? "ascending" } : null}
        empty={
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{t("empty.title")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        }
      />
    </section>
  );
}

/** The range's totals, each with what explains it under the figure. */
function Cards({ totals }: { totals: CountsBody }) {
  const t = useTranslations("Admin.reports.card");
  const format = useFormatter();
  const share = shareOf(totals);
  const cards = [
    {
      key: "views",
      figure: format.number(totals.views),
      note: t("viewsNote", { people: totals.people, qr: totals.qrViews }),
    },
    {
      key: "held",
      figure: format.number(totals.held),
      note: t("heldNote", { units: totals.unitsHeld }),
    },
    {
      key: "collected",
      figure: format.number(totals.unitsCollected),
      note: t("collectedNote", { orders: totals.collected }),
    },
    {
      key: "share",
      figure: share === null ? "–" : `${share}%`,
      note: t("shareNote", { collected: totals.collected, held: totals.held }),
    },
    {
      key: "expired",
      figure: format.number(totals.expired),
      note: t("expiredNote", { cancelled: totals.cancelled, refused: totals.refused }),
    },
  ] as const;

  return (
    <dl
      aria-label={useTranslations("Admin.reports")("cards")}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      {cards.map((card) => (
        <div
          key={card.key}
          className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4"
        >
          <dt className="text-body-sm-strong text-muted-foreground">{t(card.key)}</dt>
          <dd className="font-display text-display text-foreground">{card.figure}</dd>
          <dd className="text-body-sm text-muted-foreground">{card.note}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The orders held and collected each day of the range, as bars side by side. */
function DayBars({ days }: { days: ReportOutputBody["days"] & object }) {
  const t = useTranslations("Admin.reports");
  const format = useFormatter();
  const config = {
    held: { label: t("series.held"), color: "var(--primary)" },
    collected: { label: t("series.collected"), color: "var(--success)" },
  } satisfies ChartConfig;
  const data = days.map((d) => ({
    day: format.dateTime(new Date(d.day), { day: "numeric", month: "numeric", timeZone: "UTC" }),
    held: d.counts.held,
    collected: d.counts.collected,
  }));

  return (
    <figure className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <figcaption className="text-title-lg text-foreground">{t("chart")}</figcaption>
      <ChartContainer config={config} className="aspect-auto h-60 w-full">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="held" fill="var(--color-held)" radius={4} isAnimationActive={false} />
          <Bar
            dataKey="collected"
            fill="var(--color-collected)"
            radius={4}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
    </figure>
  );
}

function useColumns(
  sort: ReportSort | null,
  dir: Sorted["direction"] | null,
  onSort: (sort: ReportSort, dir: Sorted["direction"]) => void,
): DataTableColumns<ReportStoreBody> {
  const t = useTranslations("Admin.reports");
  const format = useFormatter();
  const sorted = sort ? { column: sort, direction: dir ?? "ascending" } : null;
  const head = (column: ReportSort) => () => (
    <SortHeader
      label={t(`column.${column}`)}
      column={column}
      sorted={sorted}
      onSort={(direction) => onSort(column, direction)}
    />
  );
  // Each column as wide as its head in the wider of the two languages, measured with its sort arrow, so the
  // store's name keeps the rest (Figma AD-BC1 has no more figures than this). People and cancellations are on
  // the cards and in the CSV.
  const figure = (
    column: "views" | "offers" | "held" | "collected" | "expired",
    width: `w-${number}`,
  ) => ({
    id: column,
    header: head(column),
    meta: { width },
    cell: ({ row }: { row: { original: ReportStoreBody } }) =>
      format.number(row.original.counts[column]),
  });

  return [
    {
      id: "name",
      header: head("name"),
      cell: ({ row }) => (
        <Link
          href={`/admin/sellers/${row.original.sellerId}`}
          className={cn("text-body-sm-strong text-foreground", linkLook)}
        >
          {row.original.name}
        </Link>
      ),
    },
    figure("views", "w-26"),
    figure("offers", "w-28"),
    figure("held", "w-26"),
    figure("collected", "w-28"),
    figure("expired", "w-30"),
    {
      id: "share",
      header: head("share"),
      meta: { width: "w-32" },
      cell: ({ row }) => {
        const share = shareOf(row.original.counts);
        return share === null ? t("none") : `${share}%`;
      },
    },
    {
      id: "collectedVnd",
      header: head("collectedVnd"),
      meta: { width: "w-28" },
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatPrice(row.original.counts.collectedVnd)}</span>
      ),
    },
  ];
}
