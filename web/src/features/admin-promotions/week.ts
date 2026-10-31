// The payouts' weeks run Monday to Sunday, Vietnam time, named by their Monday as "2026-11-02".

/** A day moved by some days: "2026-11-02" and 7 is "2026-11-09". */
export function shiftDay(day: string, days: number): string {
  const moment = new Date(`${day}T00:00:00Z`);
  moment.setUTCDate(moment.getUTCDate() + days);
  return moment.toISOString().slice(0, 10);
}

/** The Monday of a day's week. */
export function mondayOf(day: string): string {
  const weekday = new Date(`${day}T00:00:00Z`).getUTCDay();
  return shiftDay(day, -((weekday + 6) % 7));
}
