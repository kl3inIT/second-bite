import {
  createLoader,
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

/** The columns the stores' table may be sorted by; the server's order, the most orders first, by default. */
export const reportSorts = [
  "name",
  "views",
  "people",
  "offers",
  "held",
  "collected",
  "expired",
  "share",
  "collectedVnd",
  "daysPosted",
  "fullDays",
  "unitsCollected",
  "unitsPosted",
  "leftover",
  "sellThrough",
] as const;

export type ReportSort = (typeof reportSorts)[number];

/** The most days one report reads, as the server allows. */
export const maxReportDays = 92;

/**
 * What the report is read by, kept in the address (SEC-80): a range of days, one store, and the column the
 * stores are sorted by. Without a range the server reads the last seven days.
 */
export const reportSearchParams = {
  from: parseAsIsoDate,
  to: parseAsIsoDate,
  store: parseAsString,
  sort: parseAsStringLiteral(reportSorts),
  dir: parseAsStringLiteral(["ascending", "descending"] as const),
};

export const loadReportSearchParams = createLoader(reportSearchParams);

/** The parts of the report a PDF may hold, in the order the print page draws them. */
export const reportParts = ["kpi", "products", "days", "analysis", "stores", "feedback"] as const;

export type ReportPart = (typeof reportParts)[number];

/**
 * What the print page reads (report-products-export increment): the report's days and store, the parts ticked
 * in the export dialog, every one by default, and whether the three numbers show their change.
 */
export const reportPrintSearchParams = {
  from: parseAsIsoDate,
  to: parseAsIsoDate,
  store: parseAsString,
  parts: parseAsArrayOf(parseAsStringLiteral(reportParts)).withDefault([...reportParts]),
  compare: parseAsBoolean.withDefault(true),
};

export const loadReportPrintSearchParams = createLoader(reportPrintSearchParams);

export const serializeReportPrint = createSerializer(reportPrintSearchParams);

const day = (d: Date) => d.toISOString().slice(0, 10);

/**
 * The query the report and its CSV are read with: the days chosen, a range longer than the server allows cut
 * to its last 92 days, and the store.
 */
export function reportQuery(filter: { from: Date | null; to: Date | null; store: string | null }): {
  since?: string;
  until?: string;
  sellerId?: string;
} {
  const query: { since?: string; until?: string; sellerId?: string } = {};
  if (filter.from) {
    const to = filter.to ?? filter.from;
    const earliest = new Date(to.getTime() - (maxReportDays - 1) * 86_400_000);
    query.since = day(filter.from < earliest ? earliest : filter.from);
    query.until = day(to);
  }
  if (filter.store) query.sellerId = filter.store;
  return query;
}
