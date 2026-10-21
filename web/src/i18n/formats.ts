import type { Formats } from "next-intl";

/**
 * The shapes a date or a number takes in the app, by name: `format.dateTime(at, "time")`. Times are on the
 * 24-hour clock in both languages; the zone is Vietnam's, set beside these in ./request.ts.
 * Adapted from BeyondPilot's web/src/i18n/formats.ts.
 */
export const formats = {
  dateTime: {
    /** "21:45": an edge of a collection window. */
    time: { hour: "2-digit", minute: "2-digit", hourCycle: "h23" },
    /** "20" and "10": the day and month an order is collected, joined as "20/10" by the catalogs. */
    dayOfMonth: { day: "2-digit" },
    monthOfYear: { month: "2-digit" },
    /** "18 tháng 10, 2026", "October 18, 2026": the day a document changed. */
    date: { day: "numeric", month: "long", year: "numeric" },
    /** "20/10/2026", "10/20/2026": a day in a table or a range. */
    day: { day: "2-digit", month: "2-digit", year: "numeric" },
    /** "20/10": a day of this year in a filter or a list. */
    dayMonth: { day: "2-digit", month: "2-digit" },
    /** "T2", "CN"; "M", "S": a weekday above a calendar's columns. */
    weekday: { weekday: "narrow" },
    /** "20/10/2026" for a date with no time of day, kept at midnight UTC, so no zone moves it a day. */
    calendarDay: { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" },
  },
  number: {
    /** "350 m": how far a seller is, under a kilometre. */
    meters: { style: "unit", unit: "meter", maximumFractionDigits: 0 },
    /** "1,2 km": how far a seller is, from a kilometre. */
    kilometers: { style: "unit", unit: "kilometer", maximumFractionDigits: 1 },
    /** "4,7": a rating. */
    oneDecimal: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
  },
} as const satisfies Formats;
