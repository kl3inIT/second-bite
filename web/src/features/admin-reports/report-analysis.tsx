"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Progress, ProgressLabel } from "@/components/ui/progress";
import { formatPrice } from "@/features/offers/format";
import type { CountsBody, ReviewCountsBody } from "@/lib/api/generated";

/** The ratings of the days chosen, as GET /admin/reviews counts them (SEC-145). */
export type Ratings = { counts: ReviewCountsBody; average?: number };

const starKeys = [
  [5, "fiveStars"],
  [4, "fourStars"],
  [3, "threeStars"],
  [2, "twoStars"],
  [1, "oneStar"],
] as const;

/** A share in whole percent, held to 0–100; none when there is nothing to share. */
const percent = (part: number, whole: number) =>
  whole > 0 ? Math.min(Math.round((part * 100) / whole), 100) : 0;

/**
 * The report's analysis (report-products-export increment), from what the report and the reviews already
 * give: the visitors followed to the orders held and collected, what one collected order holds on average,
 * and the customers' ratings of the same days.
 */
export function ReportAnalysis({ totals, ratings }: { totals: CountsBody; ratings: Ratings }) {
  const t = useTranslations("Admin.reports.analysis");

  return (
    <section aria-labelledby="report-analysis" className="flex flex-col gap-3">
      <h2 id="report-analysis" className="text-title-lg text-foreground">
        {t("title")}
      </h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <Funnel totals={totals} />
        <Averages totals={totals} />
        <RatingsCard ratings={ratings} />
      </div>
    </section>
  );
}

function Panel({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      className="flex break-inside-avoid flex-col gap-4 rounded-2xl border border-border bg-card p-4"
    >
      <h3 id={id} className="text-title text-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Each step as a bar against the visitors, with its figure and how it follows from the step before. */
function Funnel({ totals }: { totals: CountsBody }) {
  const t = useTranslations("Admin.reports.analysis");
  const format = useFormatter();
  const steps = [
    { key: "people", value: totals.people, note: "" },
    {
      key: "held",
      value: totals.held,
      note:
        totals.people > 0 ? t("perHundred", { orders: percent(totals.held, totals.people) }) : "",
    },
    {
      key: "collected",
      value: totals.collected,
      note: totals.held > 0 ? t("ofHeld", { share: percent(totals.collected, totals.held) }) : "",
    },
  ] as const;

  return (
    <Panel id="report-funnel" title={t("funnel")}>
      <div className="flex flex-col gap-3">
        {steps.map((step) => (
          <Progress key={step.key} value={percent(step.value, totals.people)}>
            <ProgressLabel>{t(step.key)}</ProgressLabel>
            <span className="ms-auto text-body-sm text-muted-foreground tabular-nums">
              <span className="text-body-sm-strong text-foreground">
                {format.number(step.value)}
              </span>
              {step.note && ` · ${step.note}`}
            </span>
          </Progress>
        ))}
      </div>
    </Panel>
  );
}

/** What a customer paid and how many portions they took, per order collected. */
function Averages({ totals }: { totals: CountsBody }) {
  const t = useTranslations("Admin.reports.analysis");
  const format = useFormatter();
  const orders = totals.collected;
  const figures = [
    {
      key: "pay",
      value: orders > 0 ? formatPrice(Math.round(totals.collectedVnd / orders)) : t("none"),
      note: t("payNote", { orders }),
    },
    {
      key: "units",
      value: orders > 0 ? format.number(totals.unitsCollected / orders, "oneDecimal") : t("none"),
      note: t("unitsNote", { units: totals.unitsCollected, orders }),
    },
  ] as const;

  return (
    <Panel id="report-averages" title={t("average")}>
      <dl className="grid grid-cols-2 gap-4">
        {figures.map((f) => (
          <div key={f.key} className="flex min-w-0 flex-col gap-1">
            <dt className="text-body-sm-strong text-muted-foreground">{t(f.key)}</dt>
            <dd className="font-display text-headline text-foreground">{f.value}</dd>
            <dd className="text-label text-muted-foreground">{f.note}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/** The mean of the reviews shown, and how many reviews gave each number of stars. */
function RatingsCard({ ratings }: { ratings: Ratings }) {
  const t = useTranslations("Admin.reports.analysis");
  const format = useFormatter();
  const total = starKeys.reduce((sum, [, key]) => sum + ratings.counts[key], 0);

  return (
    <Panel id="report-ratings" title={t("ratings", { count: total })}>
      {total === 0 ? (
        <p className="text-body-sm text-muted-foreground">{t("noRatings")}</p>
      ) : (
        <>
          <p className="flex items-baseline gap-1">
            <span className="font-display text-display text-foreground">
              {ratings.average === undefined
                ? t("none")
                : format.number(ratings.average, "oneDecimal")}
            </span>
            <span className="text-body-sm text-muted-foreground">{t("outOf")}</span>
          </p>
          <div className="flex flex-col gap-2">
            {starKeys.map(([stars, key]) => (
              <Progress key={key} value={percent(ratings.counts[key], total)}>
                <ProgressLabel>{t("stars", { stars })}</ProgressLabel>
                <span className="ms-auto text-body-sm text-muted-foreground tabular-nums">
                  {format.number(ratings.counts[key])}
                </span>
              </Progress>
            ))}
          </div>
        </>
      )}
    </Panel>
  );
}
