"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Progress } from "@/components/ui/progress";
import type { CountsBody } from "@/lib/api/generated";

import { leftoverOf, sellThroughOf } from "./report-numbers";

/**
 * What became of the portions posted in the days chosen (report-products-export increment): posted, ordered,
 * collected, left over and the share sold, from the report's counts. The bar is the share sold; each figure
 * is a column, divided by a rule on a wide screen.
 */
export function ProductsBlock({ totals }: { totals: CountsBody }) {
  const t = useTranslations("Admin.reports.products");
  const format = useFormatter();
  const share = sellThroughOf(totals);
  const figures = [
    {
      key: "posted",
      value: format.number(totals.unitsPosted),
      unit: true,
      note: t("postedNote", { offers: totals.offers }),
      tone: "text-label text-muted-foreground",
    },
    {
      key: "held",
      value: format.number(totals.unitsHeld),
      unit: true,
      note: t("heldNote", { orders: totals.held }),
      tone: "text-label text-muted-foreground",
    },
    {
      key: "collected",
      value: format.number(totals.unitsCollected),
      unit: true,
      note: t("collectedNote", { orders: totals.collected }),
      tone: "text-label-strong text-success",
    },
    {
      key: "leftover",
      value: format.number(leftoverOf(totals)),
      unit: true,
      note: t("leftoverNote"),
      tone: "text-label-strong text-warning-foreground",
    },
    {
      key: "sellThrough",
      value: share === null ? "–" : `${share}%`,
      unit: false,
      note: t("sellThroughNote", { collected: totals.unitsCollected, posted: totals.unitsPosted }),
      tone: "text-label text-muted-foreground",
    },
  ] as const;

  return (
    <section
      aria-labelledby="report-products"
      className="flex break-inside-avoid flex-col gap-4 rounded-2xl border border-border bg-card p-4"
    >
      <h2 id="report-products" className="text-title-lg text-foreground">
        {t("title")}
      </h2>
      <Progress value={share ?? 0} aria-label={t("bar")} />
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-border print:grid-cols-5">
        {figures.map((f) => (
          <div key={f.key} className="flex min-w-0 flex-col gap-1 lg:px-5 lg:first:ps-0">
            <dt className="text-body-sm-strong text-muted-foreground">{t(f.key)}</dt>
            <dd className="flex items-baseline gap-1">
              <span className="font-display text-headline text-foreground">{f.value}</span>
              {f.unit && <span className="text-body-sm text-muted-foreground">{t("unit")}</span>}
            </dd>
            <dd className={f.tone}>{f.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
