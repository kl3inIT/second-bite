import { describe, expect, it } from "vitest";

import {
  blankPromotion,
  codeOf,
  newPromotionCode,
  promotionFormOf,
  promotionProblems,
  withEnd,
  withLimit,
  withStart,
} from "./promotion-form";
import { addDays, endAfter, vietnamDateTime, vietnamDay } from "./schedule";

const now = new Date("2026-10-20T20:30:00+07:00");

describe("the code of a promotion", () => {
  it("makes up a code a counter can read, without 0, O, 1 or I", () => {
    expect(newPromotionCode(() => 0)).toBe("TASCO-AAAA");
    expect(newPromotionCode(() => 0.999)).toBe("TASCO-9999");
    expect(newPromotionCode()).toMatch(/^TASCO-[A-HJ-NP-Z2-9]{4}$/);
  });

  it("holds a typed code to capitals, digits and dashes, at most 20", () => {
    expect(codeOf("tasco 20%")).toBe("TASCO20");
    expect(codeOf("quầy-15k")).toBe("QUY-15K");
    expect(codeOf("A".repeat(30))).toHaveLength(20);
  });
});

describe("the sheet's form", () => {
  it("starts tomorrow in Vietnam and runs thirty days", () => {
    const form = blankPromotion(now, () => 0);
    expect(form.startsAt).toBe("2026-10-21T00:00");
    expect(form.endsAt).toBe("2026-11-19T23:59");
    expect(form.code).toBe("TASCO-AAAA");
    expect(promotionProblems(form)).toEqual([]);
  });

  it("keeps the uses per person within the uses in all", () => {
    const form = { ...blankPromotion(now), perUser: 5 };
    expect(withLimit(form, 3).perUser).toBe(3);
    expect(withLimit(form, 50).perUser).toBe(5);
  });

  it("keeps the end at or after the start", () => {
    const form = blankPromotion(now);
    expect(withStart(form, "2026-12-01T08:00").endsAt).toBe("2026-12-01T08:00");
    expect(withStart(form, "2026-10-25T08:00").endsAt).toBe(form.endsAt);
    expect(withEnd(form, "2026-10-01T00:00").endsAt).toBe(form.startsAt);
  });

  it("asks for a code of four characters and a store when not for every store", () => {
    const form = blankPromotion(now);
    expect(promotionProblems({ ...form, code: "AB" })).toEqual(["code"]);
    expect(promotionProblems({ ...form, allStores: false })).toEqual(["stores"]);
    expect(promotionProblems({ ...form, allStores: false, storeIds: ["s1"] })).toEqual([]);
  });

  it("opens a listed code with its values", () => {
    const form = promotionFormOf({
      id: "p1",
      code: "QUAY15K",
      description: "Giảm 15.000đ khi đổi tại quầy",
      discount: { kind: "amount", amountVnd: 15_000 },
      used: 41,
      limit: 200,
      startsAt: "2026-10-15T00:00:00+07:00",
      endsAt: "2026-11-15T23:59:00+07:00",
      stores: { kind: "some", count: 3 },
      status: "running",
    });
    expect(form).toMatchObject({
      code: "QUAY15K",
      kind: "amount",
      amountVnd: 15_000,
      limit: 200,
      startsAt: "2026-10-15T00:00",
      endsAt: "2026-11-15T23:59",
      allStores: false,
    });
  });
});

describe("days in Vietnam", () => {
  it("reads an instant's day and time in Vietnam, whatever the machine's zone", () => {
    expect(vietnamDay(new Date("2026-10-20T18:00:00Z"))).toBe("2026-10-21");
    expect(vietnamDateTime("2026-10-20T10:05:00Z")).toBe("2026-10-20T17:05");
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(endAfter("2026-10-20", "2026-10-19")).toBe("2026-10-20");
  });
});
