// Windows are in Vietnam time, which keeps one offset all year.
const VIETNAM_OFFSET = "+07:00";
const vietnamDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });

/** Today's date in Vietnam at a time of day, "20:30", as the API takes a moment; undefined without one. */
export function tonightAt(time: string | undefined, today?: Date): string | undefined {
  // The clock is read only for a time, so a page without one can still be prerendered.
  return time
    ? `${vietnamDate.format(today ?? new Date())}T${time}:00${VIETNAM_OFFSET}`
    : undefined;
}
