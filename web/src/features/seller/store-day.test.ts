import { describe, expect, it } from "vitest";

import { plain, readDay, shiftDay, vietnamToday } from "./store-day";

describe("reading text", () => {
  it("lowers it and takes the accents off, as Vietnamese writes them", () => {
    expect(plain("Bánh Mì ĐẶC BIỆT")).toBe("banh mi dac biet");
  });
});

describe("the day", () => {
  it("reads Vietnam's day, which comes before UTC's at night", () => {
    expect(vietnamToday(new Date("2026-10-21T20:00:00Z"))).toBe("2026-10-22");
    expect(vietnamToday(new Date("2026-10-21T03:00:00Z"))).toBe("2026-10-21");
  });

  it("keeps a real day of the address and falls back to today for anything else", () => {
    expect(readDay("2026-10-19", "2026-10-21")).toBe("2026-10-19");
    expect(readDay("2026-02-30", "2026-10-21")).toBe("2026-10-21");
    expect(readDay("hôm qua", "2026-10-21")).toBe("2026-10-21");
    expect(readDay(undefined, "2026-10-21")).toBe("2026-10-21");
  });

  it("moves across months and years", () => {
    expect(shiftDay("2026-10-21", -1)).toBe("2026-10-20");
    expect(shiftDay("2026-10-31", 1)).toBe("2026-11-01");
    expect(shiftDay("2026-01-01", -1)).toBe("2025-12-31");
  });
});
