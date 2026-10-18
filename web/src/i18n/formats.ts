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
  },
} as const satisfies Formats;
