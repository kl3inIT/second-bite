import { getFormatter, getTranslations } from "next-intl/server";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

import { ReportActions } from "./report-actions";
import { weeklyTotals } from "./report-query";
import { readReport } from "./reports-source";
import { SellerReportTable } from "./seller-report-table";
import { WeeklyChart } from "./weekly-chart";

/**
 * The reports (Figma AD-BC1, AD-BC2) over a range of days: the figures, posts by week and the stores' lines, with
 * the export. What the summary gives is shown for every store together; the order figures and the stores' lines
 * stay empty until SEC-13 and SEC-15, and so does everything once one store is chosen, since the summary cannot be
 * cut by store.
 */
export async function ReportsPage({ query }: { query: Promise<Record<string, unknown>> }) {
  // The address is read first: the day is the request's, never one of a prerender.
  const params = await query;
  const [{ query: report, today, summary, orders, sellers }, shell, t, format] = await Promise.all([
    readReport(params),
    getTranslations("admin.shell"),
    getTranslations("admin.reports"),
    getFormatter(),
  ]);
  const everyStore = report.sellerId === undefined;
  const sellerCount = summary.sellers.active + summary.sellers.pending + summary.sellers.blocked;
  const newAccounts = everyStore ? summary.accounts.newInRange : null;

  // Each figure with its unit ("42 đơn"); one the backend cannot give yet shows "—" and the words for no data, never
  // a zero that reads as a measurement (Figma AD-BC1 › KPI).
  const figures: { key: string; label: string; value: string | null; unit?: string }[] = [
    {
      key: "orders",
      label: t("figures.orders"),
      value: orders.orders === null ? null : format.number(orders.orders),
      unit: t("units.orders", { count: orders.orders ?? 0 }),
    },
    {
      key: "portionsSaved",
      label: t("figures.portionsSaved"),
      value: orders.portionsSaved === null ? null : format.number(orders.portionsSaved),
      unit: t("units.portions", { count: orders.portionsSaved ?? 0 }),
    },
    {
      key: "kilogramsSaved",
      label: t("figures.kilogramsSaved"),
      value: orders.kilogramsSaved === null ? null : format.number(orders.kilogramsSaved),
      unit: t("units.kilograms"),
    },
    {
      key: "noShowRate",
      label: t("figures.noShowRate"),
      value: orders.noShowRate === null ? null : `${Math.round(orders.noShowRate * 1000) / 10}%`,
    },
    {
      key: "newAccounts",
      label: t("figures.newAccounts"),
      value: newAccounts === null ? null : format.number(newAccounts),
      unit: t("units.people", { count: newAccounts ?? 0 }),
    },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-page-title text-foreground">{shell("pages.reports.label")}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <ReportActions
            query={report}
            sellerCount={sellerCount}
            sellers={sellers.map((row) => ({ value: row.sellerId, label: row.name }))}
          />
        </div>
      </div>
      <section
        aria-label={t("figures.label")}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5"
      >
        {figures.map((figure) => (
          <Card key={figure.key}>
            <CardHeader>
              <CardDescription>{figure.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="font-display text-display text-foreground">
                  {figure.value ?? "—"}
                </span>
                <span
                  className={
                    figure.value === null
                      ? "text-body-sm text-muted-foreground"
                      : "text-body-sm-strong text-foreground"
                  }
                >
                  {figure.value === null ? t("figures.noData") : figure.unit}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      <WeeklyChart weeks={everyStore ? weeklyTotals(summary.offers.postedPerDay, today) : []} />
      <SellerReportTable rows={sellers} />
    </>
  );
}
