import type { PromotionRow } from "./promotion";
import { addDays, endAfter, vietnamDateTime, vietnamDay } from "./schedule";

/** A store a code can be given to. */
export type StoreOption = { id: string; name: string };

/** Where a code is redeemed (Figma AD-MK2 › Kênh đổi mã): the Tasco mini app, the Tasco Mall counter, or both. */
export const redeemChannels = ["app", "both", "counter"] as const;
export type RedeemChannel = (typeof redeemChannels)[number];

/** What the "Tạo mã" sheet holds (Figma AD-MK2). Days and times are Vietnam wall-clock values (schedule.ts). */
export type PromotionForm = {
  code: string;
  kind: "percent" | "amount";
  percent: number;
  amountVnd: number;
  capVnd: number;
  limit: number;
  perUser: number;
  startsAt: string;
  endsAt: string;
  allStores: boolean;
  storeIds: string[];
  channel: RedeemChannel;
};

/**
 * The bounds of the sheet's numbers. A share is 1–100%, an amount or a cap 1.000đ–1.000.000đ, a code is used up
 * to 100.000 times, and once per person at most as many times as in all ("Mỗi người dùng" ≤ "Tổng số lượt").
 */
export const promotionBounds = {
  percent: { min: 1, max: 100 },
  amountVnd: { min: 1_000, max: 1_000_000 },
  capVnd: { min: 1_000, max: 1_000_000 },
  limit: { min: 1, max: 100_000 },
  perUser: { min: 1 },
} as const;

export const codeLength = { min: 4, max: 20 } as const;

// No 0/O or 1/I, which read alike at a counter.
const codeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** A new code to start from, "TASCO-7KQ2"; the admin can change it. `random` is Math.random's shape. */
export function newPromotionCode(random: () => number = Math.random): string {
  const tail = Array.from(
    { length: 4 },
    () => codeAlphabet[Math.floor(random() * codeAlphabet.length)],
  );
  return `TASCO-${tail.join("")}`;
}

/** A code as it is typed, held to what a code may be: capitals, digits and dashes, at most 20. */
export function codeOf(typed: string): string {
  return typed
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, codeLength.max);
}

/** The new code's form: tomorrow's start of day to thirty days on, 20% capped at 30.000đ, 100 uses, once each. */
export function blankPromotion(now: Date, random: () => number = Math.random): PromotionForm {
  const start = addDays(vietnamDay(now), 1);
  return {
    code: newPromotionCode(random),
    kind: "percent",
    percent: 20,
    amountVnd: 10_000,
    capVnd: 30_000,
    limit: 100,
    perUser: 1,
    startsAt: `${start}T00:00`,
    endsAt: `${addDays(start, 29)}T23:59`,
    allStores: true,
    storeIds: [],
    channel: "both",
  };
}

/** A listed code in the sheet, to change it. Where it is redeemed is not listed, so it shows both channels. */
export function promotionFormOf(row: PromotionRow): PromotionForm {
  return {
    code: row.code,
    kind: row.discount.kind,
    percent: row.discount.kind === "percent" ? row.discount.percent : 20,
    amountVnd: row.discount.kind === "amount" ? row.discount.amountVnd : 10_000,
    capVnd: row.discount.kind === "percent" ? (row.discount.capVnd ?? 30_000) : 30_000,
    limit: row.limit,
    perUser: 1,
    startsAt: vietnamDateTime(row.startsAt),
    endsAt: vietnamDateTime(row.endsAt),
    allStores: row.stores.kind === "all",
    storeIds: [],
    channel: "both",
  };
}

export type NumberBounds = { min: number; max: number };

/**
 * What a number field does with what was typed (Figma Admin/FormField + Admin/Input): it never holds a value
 * outside its bounds (docs: admin-web-flow › Lỗi ở form). Digits over `max` become `max` at once; an empty field,
 * or one under `min`, keeps what was typed as its `draft` until it is left (`leftNumber`). `value` is the number
 * the form now holds, when it changed.
 */
export function typedNumber(
  text: string,
  bounds: NumberBounds,
): { value?: number; draft?: string } {
  const digits = text.replace(/\D/g, "").slice(0, 9);
  if (digits === "") return { draft: "" };
  const typed = Number(digits);
  if (typed > bounds.max) return { value: bounds.max };
  return { value: Math.max(typed, bounds.min), draft: typed < bounds.min ? digits : undefined };
}

/** The number a field holds once it is left with a draft: empty or under `min` becomes `min`. */
export function leftNumber(draft: string, bounds: NumberBounds): number {
  return Math.min(bounds.max, Math.max(bounds.min, Number(draft || bounds.min)));
}

/** The form after "Tổng số lượt" changed: "Mỗi người dùng" never goes over it. */
export function withLimit(form: PromotionForm, limit: number): PromotionForm {
  return {
    ...form,
    limit,
    perUser: Math.min(limit, Math.max(promotionBounds.perUser.min, form.perUser)),
  };
}

/** The form after the start moved: an end before it moves with it. */
export function withStart(form: PromotionForm, startsAt: string): PromotionForm {
  return { ...form, startsAt, endsAt: endAfter(startsAt, form.endsAt) };
}

/** The form after the end moved: never before the start. */
export function withEnd(form: PromotionForm, endsAt: string): PromotionForm {
  return { ...form, endsAt: endAfter(form.startsAt, endsAt) };
}

export type PromotionProblem = "code" | "stores";

/**
 * What the form still lacks, which the sheet shows at its field: a code of at least four characters, and a store
 * when the code is not for every store. Everything else is held to its bounds as it is typed.
 */
export function promotionProblems(form: PromotionForm): PromotionProblem[] {
  const problems: PromotionProblem[] = [];
  if (form.code.length < codeLength.min) problems.push("code");
  if (!form.allStores && form.storeIds.length === 0) problems.push("stores");
  return problems;
}
