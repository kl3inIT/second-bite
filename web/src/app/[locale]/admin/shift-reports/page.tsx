import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { isoDay, vietnamToday } from "@/features/admin-reports/report-numbers";
import { loadShiftReportSearchParams } from "@/features/admin-shift-report/search-params";
import { ShiftReportView } from "@/features/admin-shift-report/shift-report-view";
import { shiftReportQuery, shiftsOf } from "@/features/admin-shift-report/shifts";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { getShiftReport, listSellersForAdmins } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.shiftReports");
  return { title: t("title") };
}

const dayMs = 86_400_000;

// The orders and their buyers by day and shift (SEC-209, Figma "Báo cáo theo ca"): the report read on the
// server for the days, the store and the shifts in the address, and the stores the "Cửa hàng" filter offers, at
// most a hundred as the pilot has. Without days the last three are read, today included; the Excel workbook is
// the server's too, downloaded from the same query.
export default async function ShiftReportsPage({
  searchParams,
}: PageProps<"/[locale]/admin/shift-reports">) {
  await requireAdmin("/admin/shift-reports");
  const filter = loadShiftReportSearchParams(await searchParams);
  const today = vietnamToday();
  const clamp = (d: Date) => (d > today ? today : d);
  const toDay = clamp(filter.to ?? filter.from ?? today);
  const from = filter.from ? clamp(filter.from) : new Date(toDay.getTime() - 2 * dayMs);
  const range = { from: from <= toDay ? from : toDay, to: toDay };
  const shifts = shiftsOf(filter.shift);
  const query = shiftReportQuery({ ...range, store: filter.store, shifts });

  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);
  const [{ data: report }, { data: sellers }] = await Promise.all([
    getShiftReport({ headers, query }),
    listSellersForAdmins({ headers, query: { sort: "name", size: 100 } }),
  ]);

  return (
    <>
      <AdminTopBar crumbs={[{ label: t("shiftReports.title") }]} />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <h1 className="text-page-title text-foreground">{t("shiftReports.title")}</h1>
        <ShiftReportView
          report={report}
          stores={(sellers.items ?? []).map((s) => ({ id: s.id, name: s.name }))}
          range={{
            from: new Date(`${isoDay(range.from)}T00:00:00Z`),
            to: new Date(`${isoDay(range.to)}T00:00:00Z`),
          }}
          shifts={shifts}
        />
      </div>
    </>
  );
}
