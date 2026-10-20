/**
 * Days as the admin summary takes them (`GET /admin/summary?from=&to=`): "2026-10-20", a calendar day in Vietnam
 * time, both ends included. Pure, so the dashboard and the reports share them and the tests reach them.
 */
export type Day = string;

const vietnam = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });

/** The day it is in Vietnam at `now`. */
export function dayInVietnam(now: Date): Day {
  return vietnam.format(now);
}

/** Whether `value` is a real day written as YYYY-MM-DD. */
export function isDay(value: unknown): value is Day {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return toUtc(value).toISOString().startsWith(value);
}

/** The day `count` days after `day` (before it when negative). */
export function addDays(day: Day, count: number): Day {
  const at = toUtc(day);
  at.setUTCDate(at.getUTCDate() + count);
  return at.toISOString().slice(0, 10);
}

/** The days from `from` to `to`, both included: 1 for a single day. */
export function daysBetween(from: Day, to: Day): number {
  return Math.round((toUtc(to).getTime() - toUtc(from).getTime()) / 86_400_000) + 1;
}

/** Monday 0 … Sunday 6, the week as Vietnam counts it. */
export function weekday(day: Day): number {
  return (toUtc(day).getUTCDay() + 6) % 7;
}

/**
 * A day as a Date that names the same day wherever it is formatted or shown: noon in Vietnam (05:00 UTC) falls on
 * that day in Vietnam time, which the app's formats use, and in the local calendar of any browser from UTC-5 to
 * UTC+18.
 */
export function dayToDate(day: Day): Date {
  return new Date(`${day}T05:00:00Z`);
}

/** The day a calendar picked: its local year, month and day, as the calendar draws them. */
export function dateToDay(date: Date): Day {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${dayOfMonth}`;
}

function toUtc(day: Day): Date {
  return new Date(`${day}T00:00:00Z`);
}
