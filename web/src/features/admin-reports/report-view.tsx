"use client";

import { CopyIcon, DownloadIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useFormatter, useTranslations } from "next-intl";
import { useId, useMemo, useState, useTransition } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button, buttonVariants } from "@/components/ui/button";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
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

import {
  periodBefore,
  presetOf,
  presetRange,
  presets,
  signed,
  vietnamToday,
} from "./report-numbers";
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
 * The prototype's numbers (SEC-80): the days and a store in the address, the totals as cards, the days as bars,
 * and a row per store, sorted in the browser by any column as the stores are few. "Xuất CSV" downloads the same
 * numbers per day and store from the server. Since SEC-192 the three numbers the sponsor reads each day come
 * first, against `previous`, the report of the period before; "Hôm qua", "7 ngày" and "30 ngày" choose the days
 * in one tap, and "Sao chép báo cáo" copies the three as a message.
 */
export function ReportView({
  report,
  previous,
  stores,
  exportHref,
}: {
  report: ReportOutputBody;
  previous: CountsBody | null;
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

  const [today] = useState(() => vietnamToday());
  const chosen = presetOf(params.from, params.to, today);
  const { days } = periodBefore(report.since, report.until);
  const copy = useCopyReport(
    report,
    previous,
    days,
    stores.find((s) => s.id === params.store)?.name,
  );

  return (
    <section aria-label={t("title")} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <fieldset aria-label={t("presets.label")} className="flex gap-2">
          {presets.map((preset) => (
            <Button
              key={preset}
              variant="choice"
              size="default"
              aria-pressed={chosen === preset}
              onClick={() => {
                const range = presetRange(preset, today);
                void setParams({ from: range?.from ?? null, to: range?.to ?? null });
              }}
            >
              {t(`presets.${preset}`)}
            </Button>
          ))}
        </fieldset>
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
        {/* The two actions keep together, at the row's end, or on a line of their own when it is full. */}
        <div className="flex flex-wrap gap-3 sm:ms-auto">
          <Button variant="secondary" size="lg" onClick={copy}>
            <CopyIcon data-icon="inline-start" />
            {t("copy.action")}
          </Button>
          {/* A plain download: the server answers the file and its name, under the session's cookie. */}
          <a href={exportHref} download className={buttonVariants({ size: "lg" })}>
            <DownloadIcon data-icon="inline-start" />
            {t("export")}
          </a>
        </div>
      </div>
      <Cards totals={report.totals} previous={previous} accounts={report.accounts} days={days} />
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

/** How a figure moved against the period before, as a chip beside it. */
function Change({ now, before, days }: { now: number; before: number | undefined; days: number }) {
  const t = useTranslations("Admin.reports.card");
  if (before === undefined) return null;
  const tone =
    now > before
      ? "bg-fresh-muted text-success"
      : now < before
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-body-sm-strong", tone)}>
      {t("change", { change: signed(now, before), days })}
    </span>
  );
}

/**
 * The three numbers the sponsor reads each day (SEC-192), each against the period before of the same length:
 * new users, for the whole site whatever store is chosen, with the customers who ordered for the first time;
 * orders held; and people. Under them, how the orders ended.
 */
function Cards({
  totals,
  previous,
  accounts,
  days,
}: {
  totals: CountsBody;
  previous: CountsBody | null;
  accounts: number;
  days: number;
}) {
  const t = useTranslations("Admin.reports");
  const card = useTranslations("Admin.reports.card");
  const format = useFormatter();
  const share = shareOf(totals);
  const headline = [
    {
      key: "newUsers",
      figure: totals.newAccounts,
      before: previous?.newAccounts,
      note: card("newUsersNote", { customers: totals.newCustomers, accounts }),
      site: true,
    },
    {
      key: "orders",
      figure: totals.held,
      before: previous?.held,
      note: card("ordersNote", { collected: totals.collected, units: totals.unitsHeld }),
      site: false,
    },
    {
      key: "people",
      figure: totals.people,
      before: previous?.people,
      note: card("peopleNote", { views: totals.views, qr: totals.qrViews }),
      site: false,
    },
  ] as const;
  const detail = [
    {
      key: "collected",
      figure: format.number(totals.unitsCollected),
      note: card("collectedNote", { orders: totals.collected }),
    },
    {
      key: "share",
      figure: share === null ? "–" : `${share}%`,
      note: card("shareNote", { collected: totals.collected, held: totals.held }),
    },
    {
      key: "expired",
      figure: format.number(totals.expired),
      note: card("expiredNote", { cancelled: totals.cancelled, refused: totals.refused }),
    },
    {
      key: "collectedVnd",
      figure: formatPrice(totals.collectedVnd),
      note: card("collectedVndNote", { orders: totals.collected }),
    },
  ] as const;

  return (
    <>
      <dl aria-label={t("headline")} className="grid gap-4 md:grid-cols-3">
        {headline.map((c) => (
          <div
            key={c.key}
            className="flex flex-col gap-1 rounded-2xl border border-secondary bg-card p-4"
          >
            <dt className="flex items-center gap-2 text-body-sm-strong text-muted-foreground">
              {card(c.key)}
              {c.site && (
                <span className="rounded-full border border-border px-2 text-label text-muted-foreground">
                  {card("site")}
                </span>
              )}
            </dt>
            <dd className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-display text-foreground">
                {format.number(c.figure)}
              </span>
              <Change now={c.figure} before={c.before} days={days} />
            </dd>
            <dd className="text-body-sm text-muted-foreground">{c.note}</dd>
          </div>
        ))}
      </dl>
      <dl aria-label={t("detail")} className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {detail.map((c) => (
          <div
            key={c.key}
            className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4"
          >
            <dt className="text-body-sm-strong text-muted-foreground">{card(c.key)}</dt>
            <dd className="font-display text-headline text-foreground">{c.figure}</dd>
            <dd className="text-body-sm text-muted-foreground">{c.note}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

const charts = ["orders", "people", "users"] as const;
type Chart = (typeof charts)[number];

/**
 * The days of the range as bars (NN/g: length for quantities), one of three charts chosen by its tab: the
 * orders held and collected, the people, or the new accounts and first-time customers (SEC-192).
 */
function DayBars({ days }: { days: ReportOutputBody["days"] & object }) {
  const t = useTranslations("Admin.reports");
  const format = useFormatter();
  const [chart, setChart] = useState<Chart>("orders");
  const caption = useId();
  const series = {
    orders: {
      held: { label: t("series.held"), color: "var(--primary)" },
      collected: { label: t("series.collected"), color: "var(--success)" },
    },
    people: { people: { label: t("series.people"), color: "var(--primary)" } },
    users: {
      newAccounts: { label: t("series.newAccounts"), color: "var(--primary)" },
      newCustomers: { label: t("series.newCustomers"), color: "var(--success)" },
    },
  } satisfies Record<Chart, ChartConfig>;
  const config = series[chart];
  const data = days.map((d) => ({
    day: format.dateTime(new Date(d.day), { day: "numeric", month: "numeric", timeZone: "UTC" }),
    ...d.counts,
  }));

  return (
    // Named by its heading: the tabs share its row, so it cannot be the figure's caption.
    <figure
      aria-labelledby={caption}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={caption} className="text-title-lg text-foreground">
          {t(`chart.${chart}`)}
        </h2>
        <Tabs value={chart} onValueChange={(value) => setChart(value as Chart)}>
          <TabsList variant="line" aria-label={t("chart.label")}>
            {charts.map((c) => (
              <TabsTrigger key={c} value={c}>
                {t(`chart.tab.${c}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <ChartContainer config={config} className="aspect-auto h-60 w-full">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {Object.keys(config).map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`var(--color-${key})`}
              radius={4}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </figure>
  );
}

/**
 * Copies the three numbers as a short message to paste in a chat (SEC-192): the days, each number with its
 * change against the period before, and the store when one is chosen.
 */
function useCopyReport(
  report: ReportOutputBody,
  previous: CountsBody | null,
  days: number,
  store: string | undefined,
) {
  const t = useTranslations("Admin.reports.copy");
  const format = useFormatter();
  const { totals } = report;
  const change = (now: number, before: number | undefined) =>
    before === undefined ? "" : t("change", { change: signed(now, before) });
  const day = (iso: string) =>
    format.dateTime(new Date(iso), { day: "numeric", month: "numeric", timeZone: "UTC" });
  const range =
    report.since === report.until
      ? day(report.since)
      : `${day(report.since)} – ${day(report.until)}`;

  const text = [
    store ? t("titleStore", { range, store }) : t("title", { range }),
    t("users", {
      accounts: totals.newAccounts,
      change: change(totals.newAccounts, previous?.newAccounts),
      customers: totals.newCustomers,
      total: report.accounts,
    }),
    t("orders", {
      held: totals.held,
      change: change(totals.held, previous?.held),
      collected: totals.collected,
    }),
    t("people", {
      people: totals.people,
      change: change(totals.people, previous?.people),
      views: totals.views,
    }),
    ...(previous ? [t("compared", { days })] : []),
  ].join("\n");

  return () => {
    navigator.clipboard.writeText(text).then(
      () => toast.add({ type: "success", title: t("done") }),
      () => toast.add({ type: "error", title: t("failed") }),
    );
  };
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
  // store's name keeps the rest. Cancellations are on the cards and in the CSV.
  const figure = (
    column: "views" | "people" | "offers" | "held" | "collected" | "expired",
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
    figure("people", "w-36"),
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
