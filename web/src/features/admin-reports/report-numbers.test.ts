import { describe, expect, it } from "vitest";

import { periodBefore, presetOf, presetRange, signed, vietnamToday } from "./report-numbers";

const day = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe("the report's numbers (SEC-192)", () => {
  it("counts today in Vietnam, seven hours ahead of UTC", () => {
    expect(vietnamToday(Date.parse("2026-10-30T16:59:00Z")).toISOString()).toBe(
      "2026-10-30T00:00:00.000Z",
    );
    expect(vietnamToday(Date.parse("2026-10-30T17:00:00Z")).toISOString()).toBe(
      "2026-10-31T00:00:00.000Z",
    );
  });

  it("reads each preset's days and finds the preset back from the address", () => {
    const today = day("2026-10-31");
    expect(presetRange("yesterday", today)).toEqual({
      from: day("2026-10-30"),
      to: day("2026-10-30"),
    });
    expect(presetRange("week", today)).toBeNull();
    expect(presetRange("month", today)).toEqual({ from: day("2026-10-02"), to: today });

    expect(presetOf(day("2026-10-30"), day("2026-10-30"), today)).toBe("yesterday");
    expect(presetOf(null, null, today)).toBe("week");
    expect(presetOf(day("2026-10-02"), today, today)).toBe("month");
    expect(presetOf(day("2026-10-29"), day("2026-10-30"), today)).toBeNull();
  });

  it("compares a range with the same number of days before it", () => {
    expect(periodBefore("2026-10-30", "2026-10-30")).toEqual({
      since: "2026-10-29",
      until: "2026-10-29",
      days: 1,
    });
    expect(periodBefore("2026-10-25", "2026-10-31")).toEqual({
      since: "2026-10-18",
      until: "2026-10-24",
      days: 7,
    });
    expect(periodBefore("2026-11-01", "2026-11-02")).toEqual({
      since: "2026-10-30",
      until: "2026-10-31",
      days: 2,
    });
  });

  it("writes a change with its sign", () => {
    expect(signed(5, 3)).toBe("+2");
    expect(signed(3, 5)).toBe("−2");
    expect(signed(4, 4)).toBe("0");
  });
});
