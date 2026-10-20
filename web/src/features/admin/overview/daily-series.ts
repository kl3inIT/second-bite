import type { DayCountBody } from "@/lib/api/generated";

/** One day of the dashboard's chart: the posts it drew, and the accounts opened that day for the tooltip. */
export type DailyPoint = { date: string; posts: number; accounts: number };

/**
 * The y axis's ticks for counts up to `max`: from 0 in a round step (1, 2 or 5 times a power of ten), at most five
 * steps, the top one at or over `max`. An empty or small series still gets 0 to 4, so a flat line sits low.
 */
export function axisTicks(max: number): number[] {
  const top = Math.max(max, 4);
  const raw = top / 5;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = Math.max(
    1,
    ([1, 2, 5, 10].find((each) => each * magnitude >= raw) ?? 10) * magnitude,
  );
  const count = Math.ceil(top / step);
  return Array.from({ length: count + 1 }, (_, index) => index * step);
}

/**
 * The chart's days from the summary's two series, matched by day: `postedPerDay` gives the days (every day of the
 * range, zeros included) and a day missing from `newPerDay` counts no account.
 */
export function dailySeries(posted: DayCountBody[], accounts: DayCountBody[]): DailyPoint[] {
  const opened = new Map(accounts.map((day) => [day.date, day.count]));
  return posted.map((day) => ({
    date: day.date,
    posts: day.count,
    accounts: opened.get(day.date) ?? 0,
  }));
}
