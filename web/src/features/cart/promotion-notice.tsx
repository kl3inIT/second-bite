"use client";

import { GiftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { formatPrice } from "@/features/offers/format";
import {
  listRunningPromotions,
  type PromotionRuleBody,
  type RunningPromotionBody,
} from "@/lib/api/generated";

/**
 * The promotions running for the cart's sellers, as a notice in the summary (buyer-discount increment): each
 * promotion's name, what each of its rules takes off and from what amount, and how many times a day a phone number
 * gets it. What this customer gets is said on the order once it is placed, never here: answering it for a phone
 * number would tell anyone who typed a number whether that person has bought before.
 */
export function PromotionNotice({ sellerIds }: { sellerIds: string[] }) {
  const promotions = useRunningPromotions(sellerIds);
  const t = useTranslations("Cart.promotion");

  if (promotions.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {promotions.map((promotion) => (
        <section
          key={promotion.id}
          aria-label={promotion.name}
          className="flex gap-2.5 rounded-xl bg-fresh-muted px-3 py-2.5 text-body-sm text-fresh-foreground"
        >
          <GiftIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <p className="text-body-sm-strong">{promotion.name}</p>
            <ul>
              {promotion.rules
                .filter((rule) => appliesTo(rule, sellerIds))
                .map((rule) => (
                  <li key={rule.name}>
                    <RuleLine rule={rule} />
                  </li>
                ))}
            </ul>
            {promotion.perPhonePerDay > 0 && (
              <p>{t("perDay", { count: promotion.perPhonePerDay })}</p>
            )}
            <p>{t("after")}</p>
          </div>
        </section>
      ))}
    </div>
  );
}

function RuleLine({ rule }: { rule: PromotionRuleBody }) {
  const t = useTranslations("Cart.promotion");
  const { reward } = rule;
  const amount =
    reward.type === "fixed"
      ? formatPrice(reward.value)
      : t("percent", { value: reward.value, max: formatPrice(reward.maxVnd ?? 0) });
  const from = rule.conditions.find((c) => c.attribute === "subtotal" && c.operator === "gte");
  return t("rule", {
    rule: rule.name,
    amount,
    from: from ? formatPrice(Number(from.values[0])) : "none",
  });
}

/** Whether a rule may apply to one of the cart's sellers: one it does not name among those it leaves out. */
function appliesTo(rule: PromotionRuleBody, sellerIds: string[]): boolean {
  return rule.conditions.every((c) => {
    if (c.attribute !== "seller") return true;
    const named = sellerIds.filter((id) => c.values.includes(id));
    return c.operator === "in" ? named.length > 0 : named.length < sellerIds.length;
  });
}

/** The promotions running for the sellers, read once the cart shows them; none until they arrive. */
function useRunningPromotions(sellerIds: string[]): RunningPromotionBody[] {
  const [promotions, setPromotions] = useState<RunningPromotionBody[]>([]);
  const key = sellerIds.toSorted().join(",");

  useEffect(() => {
    if (key === "") return;
    let current = true;
    listRunningPromotions({ query: { sellerId: key.split(",") } })
      .then(({ data }) => {
        if (current) setPromotions(data.promotions);
      })
      // Without an answer the cart shows no notice; the order still takes its discount when placed.
      .catch(() => undefined);
    return () => {
      current = false;
    };
  }, [key]);

  return key === "" ? [] : promotions;
}
