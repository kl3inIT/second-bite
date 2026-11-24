import { createLoader, parseAsArrayOf, parseAsIsoDate, parseAsString } from "nuqs/server";

/**
 * What the shift report is read by, kept in the address (SEC-209): a range of days, one store and the shifts
 * (HH:MM-HH:MM,Name, in order). Without a range the report reads the last three days; without shifts, the three
 * of the day.
 */
export const shiftReportSearchParams = {
  from: parseAsIsoDate,
  to: parseAsIsoDate,
  store: parseAsString,
  shift: parseAsArrayOf(parseAsString, ";"),
};

export const loadShiftReportSearchParams = createLoader(shiftReportSearchParams);
