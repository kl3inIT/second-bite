import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { ReportView } from "@/features/admin-reports/report-view";
import { StoreFeedbackCard } from "@/features/admin-reports/store-feedback-card";
import { periodBefore } from "@/features/admin-reports/report-numbers";
import { loadReportSearchParams, reportQuery } from "@/features/admin-reports/search-params";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { getReport, listSellerFeedbackForAdmins, listSellersForAdmins } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.reports");
  return { title: t("title") };
}

// The prototype's numbers (SEC-80, Figma AD-BC1 as a reference only): the report read on the server for the
// days and the store in the address, and the stores the "Cửa hàng" filter offers, at most a hundred as the
// pilot has. The CSV is the server's too, downloaded from the same query. Under it, what the stores told the
// team in the same days and store (SEC-82). The period before, of the same length and store, is read after the
// report, whose days it follows, for the changes the three main numbers show (SEC-192).
export default async function ReportsPage({ searchParams }: PageProps<"/[locale]/admin/reports">) {
  await requireAdmin("/admin/reports");
  const filter = loadReportSearchParams(await searchParams);
  const query = reportQuery(filter);
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);

  const [{ data: report }, { data: sellers }, { data: feedback }] = await Promise.all([
    getReport({ headers, query }),
    listSellersForAdmins({ headers, query: { sort: "name", size: 100 } }),
    listSellerFeedbackForAdmins({ headers, query }),
  ]);

  const before = periodBefore(report.since, report.until);
  const { data: previous } = await getReport({
    headers,
    query: { since: before.since, until: before.until, sellerId: query.sellerId },
  });

  return (
    <>
      <AdminTopBar crumbs={[{ label: t("reports.title") }]} />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <h1 className="text-page-title text-foreground">{t("reports.title")}</h1>
        <ReportView
          report={report}
          previous={previous.totals}
          stores={(sellers.items ?? []).map((s) => ({ id: s.id, name: s.name }))}
          exportHref={`/api/admin/reports/export?${new URLSearchParams(query)}`}
        />
        <StoreFeedbackCard items={feedback.items} />
      </div>
    </>
  );
}
