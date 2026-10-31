import { z } from "zod";

import type {
  PromotionBody,
  PromotionConditionBody,
  PromotionInputBody,
  PromotionRuleBody,
} from "@/lib/api/generated";

// A promotion as the admin's form holds it, and back (buyer-discount increment): times as the browser's
// `datetime-local` writes them in Vietnam time, amounts as typed ("2.500.000"), and each rule's conditions as rows
// of an attribute, an operator and a value, as Medusa's rules form draws them.

export type Attribute = PromotionConditionBody["attribute"];
export type Operator = PromotionConditionBody["operator"];

export type ConditionValues = {
  attribute: Attribute;
  operator: Operator;
  /** "new" or "returning" for the customer; an amount for the dishes. */
  value: string;
  /** The stores, for a store condition. */
  sellerIds: string[];
};

export type RuleValues = {
  name: string;
  conditions: ConditionValues[];
  type: PromotionRuleBody["reward"]["type"];
  value: string;
  maxVnd: string;
};

export type PromotionValues = {
  name: string;
  startsAt: string;
  endsAt: string;
  allSellers: boolean;
  sellerIds: string[];
  budgetVnd: string;
  perPhonePerDay: string;
  enabled: boolean;
  rules: RuleValues[];
};

/** The operators each attribute takes, the first its default. */
export const operatorsOf: Record<Attribute, Operator[]> = {
  customer: ["eq"],
  subtotal: ["gte", "lt"],
  seller: ["in", "not_in"],
};

/** A new condition row of an attribute, with its default operator and value. */
export function conditionOf(attribute: Attribute): ConditionValues {
  return {
    attribute,
    operator: operatorsOf[attribute][0] ?? "eq",
    value: attribute === "customer" ? "new" : "",
    sellerIds: [],
  };
}

const vietnamOffset = "+07:00";

/** "2026-11-02T00:00", the browser's `datetime-local`, read as Vietnam time. */
export function instantOf(local: string): string {
  return new Date(`${local}:00${vietnamOffset}`).toISOString();
}

/** An instant as a `datetime-local` in Vietnam time, which keeps no daylight saving time. */
export function localOf(instant: string): string {
  return new Date(new Date(instant).getTime() + 7 * 3_600_000).toISOString().slice(0, 16);
}

/** The digits of an amount as typed: "2.500.000" or "2,500,000" is 2500000. */
export function amountOf(typed: string): number {
  return Number(typed.replace(/\D/g, ""));
}

/** An amount as the form shows it, grouped as Vietnamese writes it. */
function typedOf(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount);
}

/** The form's values for a promotion, or the empty form's from a day. */
export function valuesOf(promotion: PromotionBody | undefined, today: string): PromotionValues {
  if (!promotion) {
    return {
      name: "",
      startsAt: `${today}T00:00`,
      endsAt: `${today}T23:59`,
      allSellers: true,
      sellerIds: [],
      budgetVnd: "",
      perPhonePerDay: "1",
      enabled: true,
      rules: [],
    };
  }
  return {
    name: promotion.name,
    startsAt: localOf(promotion.startsAt),
    endsAt: localOf(promotion.endsAt),
    allSellers: promotion.allSellers,
    sellerIds: promotion.sellerIds,
    budgetVnd: typedOf(promotion.budgetVnd),
    perPhonePerDay: String(promotion.perPhonePerDay),
    enabled: promotion.enabled,
    rules: promotion.rules.map(ruleValuesOf),
  };
}

export function ruleValuesOf(rule: PromotionRuleBody): RuleValues {
  return {
    name: rule.name,
    conditions: rule.conditions.map((c) => ({
      attribute: c.attribute,
      operator: c.operator,
      value:
        c.attribute === "seller"
          ? ""
          : c.attribute === "subtotal"
            ? typedOf(Number(c.values[0]))
            : (c.values[0] ?? ""),
      sellerIds: c.attribute === "seller" ? c.values : [],
    })),
    type: rule.reward.type,
    value: rule.reward.type === "fixed" ? typedOf(rule.reward.value) : String(rule.reward.value),
    maxVnd: rule.reward.maxVnd ? typedOf(rule.reward.maxVnd) : "",
  };
}

export function ruleBodyOf(rule: RuleValues): PromotionRuleBody {
  return {
    name: rule.name.trim(),
    conditions: rule.conditions.map((c) => ({
      attribute: c.attribute,
      operator: c.operator,
      values:
        c.attribute === "seller"
          ? c.sellerIds
          : c.attribute === "subtotal"
            ? [String(amountOf(c.value))]
            : [c.value],
    })),
    reward:
      rule.type === "fixed"
        ? { type: "fixed", value: amountOf(rule.value) }
        : { type: "percentage", value: amountOf(rule.value), maxVnd: amountOf(rule.maxVnd) },
  };
}

/** The body the API takes for the form's values, once the schema has passed them. */
export function bodyOf(values: PromotionValues): PromotionInputBody {
  return {
    name: values.name.trim(),
    startsAt: instantOf(values.startsAt),
    endsAt: instantOf(values.endsAt),
    allSellers: values.allSellers,
    sellerIds: values.allSellers ? [] : values.sellerIds,
    budgetVnd: amountOf(values.budgetVnd),
    perPhonePerDay: amountOf(values.perPhonePerDay),
    enabled: values.enabled,
    rules: values.rules.map(ruleBodyOf),
  };
}

export type PromotionErrors = {
  name: string;
  endsAt: string;
  sellers: string;
  budget: string;
  perDay: string;
  rules: string;
};

/** The promotion's rules as the server keeps them (server/internal/order/promotion.go), worded by the screen. */
export function promotionSchema(m: PromotionErrors) {
  return z
    .object({
      name: z.string().trim().min(1, m.name).max(80, m.name),
      startsAt: z.string(),
      endsAt: z.string(),
      allSellers: z.boolean(),
      sellerIds: z.array(z.string()),
      budgetVnd: z
        .string()
        .refine((v) => amountOf(v) >= 1 && amountOf(v) <= 10_000_000_000, m.budget),
      perPhonePerDay: z
        .string()
        .refine((v) => /^\d+$/.test(v.trim()) && amountOf(v) <= 100, m.perDay),
      enabled: z.boolean(),
      rules: z.array(z.custom<RuleValues>()).min(1, m.rules).max(10, m.rules),
    })
    .refine((v) => v.endsAt > v.startsAt, { message: m.endsAt, path: ["endsAt"] })
    .refine((v) => v.allSellers || v.sellerIds.length > 0, {
      message: m.sellers,
      path: ["sellerIds"],
    });
}

export type RuleErrors = {
  name: string;
  value: string;
  percent: string;
  maxVnd: string;
  amount: string;
  stores: string;
};

/** What a rule needs before the dialog keeps it, as the server checks it, by field; empty when it is whole. */
export function ruleProblems(rule: RuleValues, m: RuleErrors): Partial<Record<string, string>> {
  const problems: Partial<Record<string, string>> = {};
  const name = rule.name.trim();
  if (name.length < 1 || name.length > 60) problems.name = m.name;
  const value = amountOf(rule.value);
  if (rule.type === "fixed" && (value < 1 || value > 10_000_000)) problems.value = m.value;
  if (rule.type === "percentage") {
    if (value < 1 || value > 100) problems.value = m.percent;
    const max = amountOf(rule.maxVnd);
    if (max < 1 || max > 10_000_000) problems.maxVnd = m.maxVnd;
  }
  rule.conditions.forEach((c, at) => {
    if (c.attribute === "subtotal" && c.value.replace(/\D/g, "") === "")
      problems[`condition${at}`] = m.amount;
    if (c.attribute === "seller" && c.sellerIds.length === 0) problems[`condition${at}`] = m.stores;
  });
  return problems;
}
