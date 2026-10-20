/**
 * A day and its month alone, "01/10" in Vietnamese and "10/01" in English, in Vietnam's time: an admin chart's
 * axis, a promotion's dates. Intl writes Vietnamese day and month without the year as "01-10", so the day is
 * formatted with its year, as Figma writes it ("01/10/2026"), and the year taken away with its separator.
 */
export function formatDayMonth(at: Date, locale: string): string {
  const parts = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).formatToParts(at);
  const kept = parts.filter((part) => part.type !== "year");
  while (kept[0]?.type === "literal") kept.shift();
  while (kept.at(-1)?.type === "literal") kept.pop();
  return kept.map((part) => part.value).join("");
}
