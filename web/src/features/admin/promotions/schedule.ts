/**
 * Days and times as the admin's forms hold them: wall-clock values in Vietnam time, "2026-11-01" and
 * "2026-11-01T00:00", which date and time inputs read and write and which compare as text. Every marketing form
 * keeps its end at or after its start this way (docs: admin-web-flow › Lỗi ở form: the form holds values to their
 * bounds instead of showing errors).
 */

const zone = "Asia/Ho_Chi_Minh";

const dayFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: zone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: zone,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** The day of an instant in Vietnam: "2026-10-20". */
export function vietnamDay(at: Date): string {
  return dayFormat.format(at);
}

/** The wall-clock time of an instant in Vietnam, for a date and time input: "2026-10-20T17:05". */
export function vietnamDateTime(at: Date | string): string {
  const instant = typeof at === "string" ? new Date(at) : at;
  return `${dayFormat.format(instant)}T${timeFormat.format(instant)}`;
}

/** The day `count` days after `day`: addDays("2026-10-31", 1) is "2026-11-01". */
export function addDays(day: string, count: number): string {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, date + count)).toISOString().slice(0, 10);
}

/** An end held at or after its start: an end moved before the start becomes the start. */
export function endAfter(start: string, end: string): string {
  return end < start ? start : end;
}
