import { describe, expect, it } from "vitest";

import { formatDayMonth } from "./day-month";

describe("a day and its month", () => {
  const first = new Date("2026-10-01T10:00:00+07:00");

  it("reads day/month in Vietnamese, with slashes as Figma writes it", () => {
    expect(formatDayMonth(first, "vi")).toBe("01/10");
  });

  it("reads month/day in English", () => {
    expect(formatDayMonth(first, "en")).toBe("10/01");
  });

  it("is the day in Vietnam, whatever the server's zone", () => {
    expect(formatDayMonth(new Date("2026-10-20T18:30:00Z"), "vi")).toBe("21/10");
  });
});
