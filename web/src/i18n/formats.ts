import type { Formats } from "next-intl";

/**
 * The shapes a date takes in the app, by name: `format.dateTime(at, "time")`. Times are on the
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
  },
} as const satisfies Formats;
