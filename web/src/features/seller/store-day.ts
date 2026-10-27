// The day a store's lists show, and how a search reads text: shared by the order list and the post list, which both
// belong to a day (SEC-78) and both search by words.

/** Lower case without accents, so "Bánh" is found by "banh" and "Đạt" by "dat". */
export function plain(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replaceAll("đ", "d")
    .replaceAll("Đ", "d")
    .toLowerCase();
}

/** A day as `2026-10-21` in Vietnam's time, to tell on which day a moment falls there. */
export const vietnamDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });

/** Today in Vietnam's time as `2026-10-21`, the day the order list opens on. */
export function vietnamToday(now: Date = new Date()): string {
  return vietnamDay.format(now);
}

const dayPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

/** The day in the address when it is a real one, today otherwise. */
export function readDay(value: string | undefined, today: string = vietnamToday()): string {
  const match = dayPattern.exec(value ?? "");
  if (!match) return today;
  const [, year, month, date] = match.map(Number);
  const moment = new Date(Date.UTC(year, month - 1, date));
  const real =
    moment.getUTCFullYear() === year &&
    moment.getUTCMonth() === month - 1 &&
    moment.getUTCDate() === date;
  return real ? (value as string) : today;
}

/** The day `by` days after (or before) another, as `YYYY-MM-DD`. */
export function shiftDay(day: string, by: number): string {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, date + by)).toISOString().slice(0, 10);
}

export { nowMs } from "@/features/orders/order";
