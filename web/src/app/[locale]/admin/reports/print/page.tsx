import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { ReportPrint } from "@/features/admin-reports/report-print";
import { periodBefore } from "@/features/admin-reports/report-numbers";
import {
  loadReportPrintSearchParams,
  reportQuery,
  serializeReportPrint,
} from "@/features/admin-reports/search-params";
import { StoreFeedbackCard } from "@/features/admin-reports/store-feedback-card";
import { vietnamMidnight } from "@/features/audit/search-params";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import {
  getReport,
  getReportAnalysis,
  listReviewsForAdmins,
  listSellerFeedbackForAdmins,
  listSellersForAdmins,
} from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.reports.print");
  return { title: t("title") };
}

// The report laid out for paper (report-products-export increment): the export dialog's PDF. It reads the same
// report as the report page, for the days and store in the address, and only what the parts ticked need: the
// period before for the changes, the ratings for the analysis, the stores' feedback.
export default async function ReportPrintPage({
  searchParams,
}: PageProps<"/[locale]/admin/reports/print">) {
  await requireAdmin("/admin/reports/print");
  const filter = loadReportPrintSearchParams(await searchParams);
  const query = reportQuery(filter);
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);
  const has = (part: (typeof filter.parts)[number]) => filter.parts.includes(part);

  const { data: report } = await getReport({ headers, query });
  const before = periodBefore(report.since, report.until);
  const [previous, ratings, deep, feedback, sellers] = await Promise.all([
    has("kpi") && filter.compare
      ? getReport({
          headers,
          query: {
            since: before.since,
            until: before.until,
            sellerId: query.sellerId,
            timeFrom: query.timeFrom,
            timeUntil: query.timeUntil,
          },
        }).then(({ data }) => data.totals)
      : null,
    has("analysis")
      ? listReviewsForAdmins({
          headers,
          query: {
            reviewedSince: vietnamMidnight(new Date(`${report.since}T00:00:00Z`)),
            reviewedUntil: vietnamMidnight(new Date(`${report.until}T00:00:00Z`), 1),
            sellerId: query.sellerId,
            size: 1,
          },
        }).then(({ data }) => ({ counts: data.counts, average: data.average }))
      : null,
    has("analysis") ? getReportAnalysis({ headers, query }).then(({ data }) => data) : null,
    has("feedback")
      ? listSellerFeedbackForAdmins({ headers, query }).then(({ data }) => data.items)
      : null,
    filter.store
      ? listSellersForAdmins({ headers, query: { sort: "name", size: 100 } }).then(
          ({ data }) => data.items ?? [],
        )
      : [],
  ]);
  const back = serializeReportPrint({
    from: filter.from,
    to: filter.to,
    store: filter.store,
    timeFrom: filter.timeFrom,
    timeUntil: filter.timeUntil,
  });

  return (
    <>
      <div className="print:hidden">
        <AdminTopBar
          crumbs={[{ label: t("reports.title") }, { label: t("reports.print.title") }]}
        />
      </div>
      <div className="flex flex-1 flex-col px-4 py-6 md:px-8 print:p-0">
        <ReportPrint
          report={report}
          previous={previous}
          ratings={ratings}
          deep={deep}
          parts={filter.parts}
          storeName={sellers.find((s) => s.id === filter.store)?.name}
          hours={{ from: filter.timeFrom, until: filter.timeUntil }}
          backHref={`/admin/reports${back}`}
        >
          {feedback && <StoreFeedbackCard items={feedback} />}
        </ReportPrint>
      </div>
    </>
  );
}
