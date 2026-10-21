import { describe, expect, it } from "vitest";

import { hasOwner, isReason, REASON_MAX, REASON_MIN } from "./review";

describe("reviewing a store (SEC-64, SEC-65)", () => {
  it("asks for a reason of ten to five hundred characters", () => {
    expect(isReason("Ảnh cửa hàng chưa phải ảnh quầy tại Tasco Mall.")).toBe(true);
    expect(isReason("")).toBe(false);
    expect(isReason("   \n ")).toBe(false);
    expect(isReason("  Sai ảnh.  ")).toBe(false);
    expect(isReason("a".repeat(REASON_MIN))).toBe(true);
    expect(isReason("a".repeat(REASON_MAX))).toBe(true);
    expect(isReason("a".repeat(REASON_MAX + 1))).toBe(false);
  });

  it("knows a store with no owner left, whose staff remain", () => {
    expect(hasOwner([{ role: "owner" }, { role: "staff" }])).toBe(true);
    expect(hasOwner([{ role: "staff" }])).toBe(false);
    expect(hasOwner([])).toBe(false);
  });
});
