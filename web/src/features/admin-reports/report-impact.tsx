"use client";

import { useFormatter, useTranslations } from "next-intl";

import { formatPrice } from "@/features/offers/format";
import type { CountsBody } from "@/lib/api/generated";

import { savedOf } from "./report-numbers";

/**
 * What the portions collected were worth (report-products-export increment), for the sponsor: the food rescued
 * in kilograms, counted on the dishes that give a weight; their value at the original price; what customers saved
 * against it; and the discounts Second Bite paid back to the stores.
 */
export function ImpactBlock({ totals }: { totals: CountsBody }) {
  const t = useTranslations("Admin.reports.impact");
  const format = useFormatter();
  const saved = savedOf(totals);
  const figures = [
    {
      key: "rescued",
      value: t("kilograms", { kg: format.number(totals.gramsCollected / 1000, "oneDecimal") }),
      note: t("rescuedNote", { weighed: totals.unitsWeighed, collected: totals.unitsCollected }),
    },
    {
      key: "original",
      value: formatPrice(totals.originalVnd),
      note: t("originalNote", { units: totals.unitsCollected }),
    },
    {
      key: "saved",
      value: formatPrice(saved),
      note:
        totals.originalVnd > 0
          ? t("savedNote", { share: Math.round((saved * 100) / totals.originalVnd) })
          : t("none"),
    },
    {
      key: "discount",
      value: formatPrice(totals.discountVnd),
      note: t("discountNote", { orders: totals.discountOrders }),
    },
  ] as const;

  return (
    <section
      aria-labelledby="report-impact"
      className="flex break-inside-avoid flex-col gap-4 rounded-2xl border border-border bg-card p-4"
    >
      <h2 id="report-impact" className="text-title-lg text-foreground">
        {t("title")}
      </h2>
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border print:grid-cols-4">
        {figures.map((f) => (
          <div key={f.key} className="flex min-w-0 flex-col gap-1 lg:px-5 lg:first:ps-0">
            <dt className="text-body-sm-strong text-muted-foreground">{t(f.key)}</dt>
            <dd className="font-display text-headline text-foreground">{f.value}</dd>
            <dd className="text-label text-muted-foreground">{f.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
