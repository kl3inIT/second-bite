import { addDays, type Day } from "./days";

/** The dashboard's span (Figma AD-TQ1, Hôm nay | 7 ngày | 30 ngày), kept in the address as `?range=`. */
export const overviewRanges = ["today", "7d", "30d"] as const;

export type OverviewRange = (typeof overviewRanges)[number];

/** The span an address asks for; today when it names none or one the dashboard does not offer. */
export function readOverviewRange(value: unknown): OverviewRange {
  return overviewRanges.find((range) => range === value) ?? "today";
}

const lengths: Record<OverviewRange, number> = { today: 1, "7d": 7, "30d": 30 };

/** The days a span covers, ending today, as `GET /admin/summary` takes them. */
export function rangeDays(range: OverviewRange, today: Day): { from: Day; to: Day } {
  return { from: addDays(today, 1 - lengths[range]), to: today };
}

/**
 * The days the chart draws: the span's, but never fewer than seven, since one day makes no line to read. Today's
 * figures still count today alone.
 */
export function chartDays(range: OverviewRange, today: Day): { from: Day; to: Day } {
  return rangeDays(range === "today" ? "7d" : range, today);
}
