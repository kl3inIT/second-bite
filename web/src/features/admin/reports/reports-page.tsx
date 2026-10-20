import { getFormatter, getTranslations } from "next-intl/server";

import { FigureCard } from "@/features/admin/overview/figure-card";
import { PageHeader } from "@/features/admin/ui/page-header";

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
  const noData = t("figures.noData");
  const sellerCount = summary.sellers.active + summary.sellers.pending + summary.sellers.blocked;
  const newAccounts = everyStore ? summary.accounts.newInRange : null;

  return (
    <>
      <PageHeader
        title={shell("pages.reports.label")}
        actions={
          <ReportActions
            query={report}
            sellerCount={sellerCount}
            sellers={sellers.map((row) => ({ value: row.sellerId, label: row.name }))}
          />
        }
      />
      <section
        aria-label={t("figures.label")}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5"
      >
        <FigureCard
          label={t("figures.orders")}
          value={orders.orders === null ? null : format.number(orders.orders)}
          unit={t("units.orders", { count: orders.orders ?? 0 })}
          noData={noData}
        />
        <FigureCard
          label={t("figures.portionsSaved")}
          value={orders.portionsSaved === null ? null : format.number(orders.portionsSaved)}
          unit={t("units.portions", { count: orders.portionsSaved ?? 0 })}
          noData={noData}
        />
        <FigureCard
          label={t("figures.kilogramsSaved")}
          value={orders.kilogramsSaved === null ? null : format.number(orders.kilogramsSaved)}
          unit={t("units.kilograms")}
          noData={noData}
        />
        <FigureCard
          label={t("figures.noShowRate")}
          value={
            orders.noShowRate === null ? null : `${Math.round(orders.noShowRate * 1000) / 10}%`
          }
          noData={noData}
        />
        <FigureCard
          label={t("figures.newAccounts")}
          value={newAccounts === null ? null : format.number(newAccounts)}
          unit={t("units.people", { count: newAccounts ?? 0 })}
          noData={noData}
        />
      </section>
      <WeeklyChart weeks={everyStore ? weeklyTotals(summary.offers.postedPerDay, today) : []} />
      <SellerReportTable rows={sellers} />
    </>
  );
}
