import "server-only";

import { adminRead } from "@/features/admin/session";
import { type AdminSummaryBody, getAdminSummary } from "@/lib/api/generated";

import { dayInVietnam } from "./days";
import { chartDays, type OverviewRange, rangeDays } from "./overview-range";

/**
 * What only orders can tell (Figma AD-TQ1: orders, portions saved, customers who came). SEC-15 has not built the
 * orders yet, so each is null and its card shows "—", never a zero that looks measured.
 */
export type OrderFigures = {
  orders: number | null;
  portionsSaved: number | null;
  collected: { count: number; of: number } | null;
};

/**
 * The to-do counts whose modules do not exist yet: problem reports (SEC-13), refunds (SEC-18) and store documents
 * (no issue yet). Null leaves the row out of "Cần xử lý".
 */
export type PendingWork = {
  issues: number | null;
  refunds: number | null;
  documents: number | null;
};

export type Overview = {
  /** The figures of the span the admin chose. */
  summary: AdminSummaryBody;
  /** The days the chart draws; the span's own unless it is today alone. */
  chart: AdminSummaryBody;
  orders: OrderFigures;
  pending: PendingWork;
};

/** The dashboard's data for a span ending today: one summary, and a second for the chart when the span is today. */
export async function readOverview(range: OverviewRange, now = new Date()): Promise<Overview> {
  const today = dayInVietnam(now);
  const read = (query: { from: string; to: string }) =>
    adminRead((headers) => getAdminSummary({ query, headers }));
  const [summary, chart] = await Promise.all([
    read(rangeDays(range, today)),
    range === "today" ? read(chartDays(range, today)) : undefined,
  ]);
  return {
    summary,
    chart: chart ?? summary,
    orders: { orders: null, portionsSaved: null, collected: null },
    pending: { issues: null, refunds: null, documents: null },
  };
}
