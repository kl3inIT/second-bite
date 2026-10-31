import { describe, expect, it } from "vitest";

import { mondayOf, shiftDay } from "./week";

describe("payout weeks", () => {
  it("names a week by its Monday, Sunday included", () => {
    expect(mondayOf("2026-11-02")).toBe("2026-11-02");
    expect(mondayOf("2026-11-08")).toBe("2026-11-02");
    expect(mondayOf("2026-11-09")).toBe("2026-11-09");
  });

  it("moves across a month's end", () => {
    expect(shiftDay("2026-10-26", 7)).toBe("2026-11-02");
    expect(shiftDay("2026-11-02", -7)).toBe("2026-10-26");
  });
});
