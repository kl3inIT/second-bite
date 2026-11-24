import { isoDay } from "@/features/admin-reports/report-numbers";

/** A named part of every day in Vietnam, [from, until) as HH:MM; `until` may be 24:00, the end of the day. */
export type Shift = { name: string; from: string; until: string };

/** The most shifts and the longest name the server allows. */
export const maxShifts = 6;
export const maxShiftName = 40;
/** The most days one report reads, as the server allows. */
export const maxShiftReportDays = 31;

/** Ca sáng, Ca chiều and Ca tối: what the server cuts a day into when no shift is asked. */
export const defaultShifts: Shift[] = [
  { name: "Ca sáng", from: "06:00", until: "12:00" },
  { name: "Ca chiều", from: "12:00", until: "18:00" },
  { name: "Ca tối", from: "18:00", until: "24:00" },
];

const clock = /^(([01][0-9]|2[0-3]):[0-5][0-9]|24:00)$/;

/** A shift as the API and the address write it: HH:MM-HH:MM,Name. */
export function shiftValue(shift: Shift): string {
  return `${shift.from}-${shift.until},${shift.name}`;
}

/** A shift read from the address; none for a value that is not one. */
export function parseShiftValue(value: string): Shift | null {
  const comma = value.indexOf(",");
  if (comma < 0) return null;
  const [from, until] = value.slice(0, comma).split("-");
  const name = value.slice(comma + 1).trim();
  if (!from || !until || !clock.test(from) || !clock.test(until)) return null;
  return { name, from, until };
}

/** The shifts of the address, the defaults when it holds none that is whole. */
export function shiftsOf(values: string[] | null): Shift[] {
  const shifts = (values ?? []).map(parseShiftValue);
  const whole = shifts.every((s) => s !== null) ? (shifts as Shift[]) : [];
  return whole.length > 0 && problemsOf(whole).length === 0 ? whole : defaultShifts;
}

/** What is wrong with a row of shifts, by the rows' number from 0; none when they follow the server's rules. */
export type ShiftProblem = {
  row: number;
  field: "name" | "from" | "until";
  reason: "name" | "hour" | "order" | "overlap" | "count";
};

/**
 * The rules the server holds the shifts to: a name of 1 to 40 characters, hours from 00:00 to 24:00 that start
 * before they end, in order and without overlap, one to six. Touching ends and gaps are allowed.
 */
export function problemsOf(shifts: Shift[]): ShiftProblem[] {
  const problems: ShiftProblem[] = [];
  shifts.forEach((s, row) => {
    const name = s.name.trim();
    if (name.length < 1 || name.length > maxShiftName)
      problems.push({ row, field: "name", reason: "name" });
    if (!clock.test(s.from) || s.from === "24:00")
      problems.push({ row, field: "from", reason: "hour" });
    if (!clock.test(s.until)) problems.push({ row, field: "until", reason: "hour" });
    if (clock.test(s.from) && clock.test(s.until) && s.from >= s.until)
      problems.push({ row, field: "until", reason: "order" });
    const before = shifts[row - 1];
    if (before && clock.test(s.from) && clock.test(before.until) && s.from < before.until)
      problems.push({ row, field: "from", reason: "overlap" });
  });
  if (shifts.length < 1 || shifts.length > maxShifts)
    problems.push({ row: 0, field: "name", reason: "count" });
  return problems;
}

/** What the report's address and its export are read by: the days, the store and the shifts, none when default. */
export function shiftReportQuery(filter: {
  from: Date;
  to: Date;
  store: string | null;
  shifts: Shift[];
}): { since: string; until: string; sellerId?: string; shift?: string[] } {
  const earliest = new Date(filter.to.getTime() - (maxShiftReportDays - 1) * 86_400_000);
  const from = filter.from < earliest ? earliest : filter.from;
  const query: { since: string; until: string; sellerId?: string; shift?: string[] } = {
    since: isoDay(from),
    until: isoDay(filter.to),
  };
  if (filter.store) query.sellerId = filter.store;
  if (JSON.stringify(filter.shifts) !== JSON.stringify(defaultShifts))
    query.shift = filter.shifts.map(shiftValue);
  return query;
}

/** A query as the export's address holds it: the shift repeated, as the server reads it. */
export function queryString(query: {
  since: string;
  until: string;
  sellerId?: string;
  shift?: string[];
}): string {
  const params = new URLSearchParams({ since: query.since, until: query.until });
  if (query.sellerId) params.set("sellerId", query.sellerId);
  for (const s of query.shift ?? []) params.append("shift", s);
  return params.toString();
}
