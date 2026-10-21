import { addDays, type Day, daysBetween, isDay, weekday } from "@/features/admin/overview/days";
import { formatDayMonth } from "@/i18n/day-month";
import type { DayCountBody } from "@/lib/api/generated";

/** The longest range the summary answers (`OFFER_SUMMARY_RANGE_TOO_LONG` past it). */
export const longestRange = 90;

/** The range a report opens on: the 30 days that end today (Figma AD-BC1). */
const defaultLength = 30;

/** What the reports show, from the address: `?from=2026-09-21&to=2026-10-20&seller=…`. */
export type ReportQuery = { from: Day; to: Day; sellerId?: string };

/**
 * The report an address asks for. A range missing, unreadable or reversed falls back to the 30 days that end today;
 * one longer than the summary answers keeps its last 90 days.
 */
export function readReportQuery(query: Record<string, unknown>, today: Day): ReportQuery {
  const sellerId = typeof query.seller === "string" && query.seller ? query.seller : undefined;
  const { from, to } = query;
  if (!isDay(from) || !isDay(to) || from > to) {
    return { from: addDays(today, 1 - defaultLength), to: today, sellerId };
  }
  const start = daysBetween(from, to) > longestRange ? addDays(to, 1 - longestRange) : from;
  return { from: start, to, sellerId };
}

/** A range of days as a calendar holds it while it is chosen: its first day, then its last. */
export type DayRange = { from?: Date; to?: Date };

/**
 * A range as its button writes it (Figma Admin/DateRange): "21/09 – 20/10/2026", each end on its own since Intl's
 * own range drops the two-digit month in Vietnamese; the start loses its year when both ends share one. One end
 * alone is written as its day; none gives `undefined`, for the button's words for any time. `day` writes a whole
 * day, the page's "day" format.
 */
export function rangeText(
  value: DayRange,
  locale: string,
  day: (at: Date) => string,
): string | undefined {
  if (value.from && value.to) {
    const from =
      value.from.getFullYear() === value.to.getFullYear()
        ? formatDayMonth(value.from, locale)
        : day(value.from);
    return `${from} – ${day(value.to)}`;
  }
  return value.from ? day(value.from) : undefined;
}

/** A week of the weekly chart, Monday to Sunday or the part of it in the range. */
export type Week = { from: Day; to: Day; count: number; running: boolean };

/**
 * The per-day counts summed by week, Monday first (Figma AD-BC1 › theo tuần). A week cut by the range keeps only
 * its days in it; the week that holds today, still under way, is `running`.
 */
export function weeklyTotals(days: DayCountBody[], today: Day): Week[] {
  const weeks: Week[] = [];
  for (const day of days) {
    const current = weeks.at(-1);
    if (current && weekday(day.date) !== 0 && daysBetween(current.from, day.date) <= 7) {
      current.to = day.date;
      current.count += day.count;
    } else {
      weeks.push({ from: day.date, to: day.date, count: day.count, running: false });
    }
  }
  const last = weeks.at(-1);
  if (last && last.to === today && weekday(today) !== 6) last.running = true;
  return weeks;
}
