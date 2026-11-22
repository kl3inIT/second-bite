import { createParser } from "nuqs/server";

/** A time of day, HH:MM from 00:00 to 23:59, or 24:00 to end at midnight, as the server reads it. */
const clock = /^(([01][0-9]|2[0-3]):[0-5][0-9]|24:00)$/;

const parseAsClock = createParser({
  parse: (value: string) => (clock.test(value) ? value : null),
  serialize: (value: string) => value,
});

/**
 * A part of every day an admin's list or report keeps, [timeFrom, timeUntil) in Vietnam, by when the window
 * starts; both absent is the whole day. The server refuses one end alone or a range that does not start before
 * it ends.
 */
export const timeSearchParams = {
  timeFrom: parseAsClock,
  timeUntil: parseAsClock,
};

/** The part of the day as the API's query reads it: both ends, or neither. */
export function timeQuery(filter: { timeFrom: string | null; timeUntil: string | null }): {
  timeFrom?: string;
  timeUntil?: string;
} {
  return filter.timeFrom && filter.timeUntil
    ? { timeFrom: filter.timeFrom, timeUntil: filter.timeUntil }
    : {};
}
