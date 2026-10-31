const dayMs = 86_400_000;

/** An ISO day, YYYY-MM-DD, of a date at midnight UTC. */
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** Today in Vietnam, as midnight UTC of that date, as the server counts days. */
export function vietnamToday(now: number = Date.now()): Date {
  return new Date(`${isoDay(new Date(now + 7 * 3_600_000))}T00:00:00Z`);
}

/** The ranges one tap chooses (SEC-192); "week" is the report's own default, the last seven days. */
export const presets = ["yesterday", "week", "month"] as const;
export type Preset = (typeof presets)[number];

/** The days a preset reads, from and to included; none for the default week. */
export function presetRange(preset: Preset, today: Date): { from: Date; to: Date } | null {
  if (preset === "week") return null;
  if (preset === "yesterday") {
    const yesterday = new Date(today.getTime() - dayMs);
    return { from: yesterday, to: yesterday };
  }
  return { from: new Date(today.getTime() - 29 * dayMs), to: today };
}

/** The preset the address holds, if any. */
export function presetOf(from: Date | null, to: Date | null, today: Date): Preset | null {
  if (from === null) return "week";
  const chosen = `${isoDay(from)} ${isoDay(to ?? from)}`;
  return (
    presets.find((preset) => {
      const range = presetRange(preset, today);
      return range !== null && chosen === `${isoDay(range.from)} ${isoDay(range.to)}`;
    }) ?? null
  );
}

/** The period before a range of days, of the same length, ending the day before it starts. */
export function periodBefore(
  since: string,
  until: string,
): { since: string; until: string; days: number } {
  const start = Date.parse(`${since}T00:00:00Z`);
  const days = Math.round((Date.parse(`${until}T00:00:00Z`) - start) / dayMs) + 1;
  return {
    since: isoDay(new Date(start - days * dayMs)),
    until: isoDay(new Date(start - dayMs)),
    days,
  };
}

/** A change written with its sign: "+2", "−3", "0". */
export function signed(now: number, before: number): string {
  const change = now - before;
  if (change > 0) return `+${change}`;
  if (change < 0) return `−${-change}`;
  return "0";
}
