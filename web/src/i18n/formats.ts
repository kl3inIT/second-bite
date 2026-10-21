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
    /** "18 tháng 10, 2026", "October 18, 2026": the day a document changed. */
    date: { day: "numeric", month: "long", year: "numeric" },
  },
  number: {
    /** "350 m": how far a seller is, under a kilometre. */
    meters: { style: "unit", unit: "meter", maximumFractionDigits: 0 },
    /** "1,2 km": how far a seller is, from a kilometre. */
    kilometers: { style: "unit", unit: "kilometer", maximumFractionDigits: 1 },
  },
} as const satisfies Formats;
