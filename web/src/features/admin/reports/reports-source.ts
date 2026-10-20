import "server-only";

import { type Day, dayInVietnam } from "@/features/admin/overview/days";
import { adminRead } from "@/features/admin/session";
import { type AdminSummaryBody, getAdminSummary } from "@/lib/api/generated";

import { type ReportQuery, readReportQuery } from "./report-query";
import type { ReportSellerRow } from "./report-rows";

/**
 * The report's figures that need orders (Figma AD-BC1 › KPI). SEC-15 has not built the orders and SEC-13 not the
 * reports, so each is null and its card shows "—".
 */
export type OrderReport = {
  orders: number | null;
  portionsSaved: number | null;
  kilogramsSaved: number | null;
  noShowRate: number | null;
};

export type Report = {
  /** The range and store the address asks for, made valid. */
  query: ReportQuery;
  /** Today in Vietnam, which marks the week still under way. */
  today: Day;
  /** The summary of the range, for every store; a report of one store cannot use it. */
  summary: AdminSummaryBody;
  orders: OrderReport;
  /** One line per store with orders in the range; none until SEC-13. */
  sellers: ReportSellerRow[];
};

/**
 * The reports' data for the address's range: the summary the backend has, and empty order figures and store lines
 * until SEC-13 and SEC-15.
 */
export async function readReport(
  params: Record<string, unknown>,
  now = new Date(),
): Promise<Report> {
  const today = dayInVietnam(now);
  const query = readReportQuery(params, today);
  const summary = await adminRead((headers) =>
    getAdminSummary({ query: { from: query.from, to: query.to }, headers }),
  );
  return {
    query,
    today,
    summary,
    orders: { orders: null, portionsSaved: null, kilogramsSaved: null, noShowRate: null },
    sellers: [],
  };
}
