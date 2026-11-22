"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Progress, ProgressLabel } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GetReportAnalysisResponse } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

export type DeepAnalysis = GetReportAnalysisResponse;

type Bar = { key: string; label: string; value: number; text: string };

/** A share in whole percent, held to 0–100; none when there is nothing to share. */
const percent = (part: number, whole: number) =>
  whole > 0 ? Math.min(Math.round((part * 100) / whole), 100) : 0;

/** One titled panel of the analysis. */
export function Panel({
  id,
  title,
  wide = false,
  actions,
  children,
}: {
  id: string;
  title: string;
  wide?: boolean;
  /** Controls beside the title, such as tabs. */
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className={
        wide
          ? "flex break-inside-avoid flex-col gap-4 rounded-2xl border border-border bg-card p-4 lg:col-span-2"
          : "flex break-inside-avoid flex-col gap-4 rounded-2xl border border-border bg-card p-4"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 id={id} className="text-title text-foreground">
          {title}
        </h4>
        {actions}
      </div>
      {children}
    </section>
  );
}

/** Rows of bars, each against the largest value or the whole it is given. */
function Bars({ bars, empty }: { bars: Bar[]; empty: string }) {
  if (bars.every((b) => b.value === 0)) {
    return <p className="text-body-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {bars.map((bar) => (
        <Progress key={bar.key} value={bar.value}>
          <ProgressLabel>{bar.label}</ProgressLabel>
          <span className="ms-auto text-body-sm text-muted-foreground tabular-nums">
            {bar.text}
          </span>
        </Progress>
      ))}
    </div>
  );
}

/** One group of panels under its heading: customers, products and prices, time, quality. */
export function Group({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h3 id={id} className="text-title-lg text-muted-foreground">
        {title}
      </h3>
      <div className="grid gap-4 lg:grid-cols-2">{children}</div>
    </section>
  );
}

const kinds = [
  "bakery",
  "prepared_food",
  "ingredients",
  "drinks",
  "mixed_box",
  "dessert",
  "snacks",
  "produce",
  "other",
] as const;
const bands = ["free", "from70", "from50", "from30", "under30"] as const;
const failures = [
  "cancelled",
  "expired",
  "refused_not_suitable",
  "refused_wrong_items",
  "refused_no_answer",
  "refused_no_show",
  "refused_late",
  "refused_sold_out",
  "refused_other",
  "refused_withdrawn",
] as const;
const tags = ["fast_pickup", "good_quality", "good_variety", "fair_portions"] as const;
const problems = ["missing_item", "wrong_item", "poor_quality", "store_closed"] as const;
const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

const known = <T extends string>(list: readonly T[], key: string): key is T =>
  (list as readonly string[]).includes(key);

/** The customers' panels the API's analysis adds: how often they came, and where the views came from. */
export function CustomerPanels({ deep }: { deep: DeepAnalysis }) {
  const t = useTranslations("Admin.reports.deep");
  const format = useFormatter();
  const customers = deep.visits.reduce((sum, v) => sum + v.count, 0);
  const views = deep.sources.reduce((sum, s) => sum + s.count, 0);
  const sourceLabel = (key: string) =>
    key === "" ? t("source.none") : key === "qr" ? t("source.qr") : key;

  return (
    <>
      <Panel id="report-visits" title={t("visits", { customers })}>
        <Bars
          empty={t("empty")}
          bars={deep.visits.map((v) => ({
            key: v.key,
            label: v.key === "3" ? t("visitsMany") : t("visitsTimes", { times: Number(v.key) }),
            value: percent(v.count, customers),
            text: t("customers", { count: v.count, share: percent(v.count, customers) }),
          }))}
        />
      </Panel>
      <Panel id="report-sources" title={t("sources", { views: format.number(views) })}>
        <Bars
          empty={t("empty")}
          bars={deep.sources.slice(0, 6).map((s) => ({
            key: s.key || "none",
            label: sourceLabel(s.key),
            value: percent(s.count, views),
            text: t("views", { count: format.number(s.count) }),
          }))}
        />
      </Panel>
    </>
  );
}

/** Portions collected of those posted, by kind and by discount, and the dishes that sold or were left most. */
export function ProductPanels({ deep }: { deep: DeepAnalysis }) {
  const t = useTranslations("Admin.reports.deep");
  const portions = (posted: number, collected: number) =>
    t("portions", { collected, posted, share: percent(collected, posted) });

  return (
    <>
      <Panel id="report-kinds" title={t("kinds")}>
        <Bars
          empty={t("empty")}
          bars={deep.kinds.map((k) => ({
            key: k.kind,
            label: known(kinds, k.kind) ? t(`kind.${k.kind}`) : k.kind,
            value: percent(k.collected, k.posted),
            text: portions(k.posted, k.collected),
          }))}
        />
      </Panel>
      <Panel id="report-discounts" title={t("discounts")}>
        <Bars
          empty={t("empty")}
          bars={deep.discounts.map((d) => ({
            key: d.band,
            label: known(bands, d.band) ? t(`band.${d.band}`) : d.band,
            value: percent(d.collected, d.posted),
            text: d.posted > 0 ? portions(d.posted, d.collected) : t("noPosts"),
          }))}
        />
      </Panel>
      <Dishes deep={deep} />
    </>
  );
}

/** The dishes collected most, or the ended ones left over most, one list at a time. */
function Dishes({ deep }: { deep: DeepAnalysis }) {
  const t = useTranslations("Admin.reports.deep");
  const [list, setList] = useState<"sold" | "left">("sold");
  const dishes = list === "sold" ? deep.topSold : deep.topLeftover;

  return (
    <Panel
      id="report-dishes"
      wide
      title={t("dishes")}
      actions={
        <Tabs value={list} onValueChange={(value) => setList(value as "sold" | "left")}>
          <TabsList variant="line" aria-label={t("dishes")}>
            <TabsTrigger value="sold">{t("topSold")}</TabsTrigger>
            <TabsTrigger value="left">{t("topLeftover")}</TabsTrigger>
          </TabsList>
        </Tabs>
      }
    >
      {dishes.length === 0 ? (
        <p className="text-body-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <ol className="flex flex-col divide-y divide-border">
          {dishes.map((d, i) => (
            <li key={d.offerId} className="flex items-baseline gap-3 py-2 first:pt-0 last:pb-0">
              <span className="w-5 shrink-0 text-body-sm-strong text-muted-foreground">
                {i + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-body-sm-strong text-foreground">{d.name}</span>
                <span className="truncate text-label text-muted-foreground">{d.sellerName}</span>
              </span>
              <span className="shrink-0 text-body-sm text-foreground tabular-nums">
                {list === "sold"
                  ? t("sold", { collected: d.collected, posted: d.posted, unit: d.unit })
                  : t("left", { left: d.posted - d.collected, posted: d.posted, unit: d.unit })}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}

/** The shade of a cell of the weekday-by-hour table, from none to the busiest. */
const shades = [
  "bg-muted text-muted-foreground",
  "bg-secondary text-foreground",
  "bg-secondary-hover text-foreground",
  "bg-primary/60 text-foreground",
  "bg-primary text-primary-foreground",
] as const;

/** When orders are collected and placed, and how long posts take to sell out. */
export function TimePanels({ deep }: { deep: DeepAnalysis }) {
  const t = useTranslations("Admin.reports.deep");
  const hours = [...new Set(deep.slots.map((s) => s.hour))].sort((a, b) => a - b);
  const held = (weekday: number, hour: number) =>
    deep.slots.find((s) => s.weekday === weekday && s.hour === hour)?.held ?? 0;
  const busiest = Math.max(0, ...deep.slots.map((s) => s.held));
  const shade = (n: number) =>
    shades[n === 0 ? 0 : Math.min(Math.ceil((n * (shades.length - 1)) / busiest), 4)];
  const collectedAt = hours.map((hour) => ({
    hour,
    collected: deep.slots.filter((s) => s.hour === hour).reduce((sum, s) => sum + s.collected, 0),
  }));
  const mostCollected = Math.max(0, ...collectedAt.map((h) => h.collected));
  const sold = deep.sellOut;
  const posts =
    sold.underHalfHour + sold.underHour + sold.underTwoHours + sold.overTwoHours + sold.notSoldOut;
  const lead = deep.leadTimes;
  const orders = lead.underHalfHour + lead.underHour + lead.underThreeHours + lead.overThreeHours;

  return (
    <>
      <Panel id="report-slots" wide title={t("slots")}>
        {hours.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-1 text-center text-label">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">{t("weekdayHead")}</span>
                  </th>
                  {hours.map((hour) => (
                    <th key={hour} scope="col" className="font-normal text-muted-foreground">
                      {t("hour", { hour })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekdays.map((day, i) => (
                  <tr key={day}>
                    <th scope="row" className="pe-2 text-start font-normal text-muted-foreground">
                      {t(`weekday.${day}`)}
                    </th>
                    {hours.map((hour) => {
                      const n = held(i + 1, hour);
                      return (
                        <td key={hour} className={cn("h-9 min-w-10 rounded-md", shade(n))}>
                          {n > 0 ? n : ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <Panel id="report-hours" title={t("hours")}>
        <Bars
          empty={t("empty")}
          bars={collectedAt.map((h) => ({
            key: String(h.hour),
            label: t("hour", { hour: h.hour }),
            value: percent(h.collected, mostCollected),
            text: t("orders", { count: h.collected }),
          }))}
        />
      </Panel>
      <Panel id="report-sellout" title={t("sellOut", { posts })}>
        <Bars
          empty={t("empty")}
          bars={(
            [
              ["underHalfHour", sold.underHalfHour],
              ["underHour", sold.underHour],
              ["underTwoHours", sold.underTwoHours],
              ["overTwoHours", sold.overTwoHours],
              ["notSoldOut", sold.notSoldOut],
            ] as const
          ).map(([key, value]) => ({
            key,
            label: t(`sellOutBand.${key}`),
            value: percent(value, posts),
            text: t("posts", { count: value }),
          }))}
        />
        {sold.medianMinutes > 0 && (
          <p className="text-label text-muted-foreground">
            {t("median", { minutes: sold.medianMinutes })}
          </p>
        )}
      </Panel>
      <Panel id="report-lead" title={t("leadTimes", { orders })}>
        <Bars
          empty={t("empty")}
          bars={(
            [
              ["underHalfHour", lead.underHalfHour],
              ["underHour", lead.underHour],
              ["underThreeHours", lead.underThreeHours],
              ["overThreeHours", lead.overThreeHours],
            ] as const
          ).map(([key, value]) => ({
            key,
            label: t(`leadBand.${key}`),
            value: percent(value, orders),
            text: t("orders", { count: value }),
          }))}
        />
      </Panel>
    </>
  );
}

/**
 * How the orders not collected ended, what the reviews praise and what customers reported; `children` (the
 * ratings) follow the failures.
 */
export function QualityPanels({
  deep,
  children,
}: {
  deep: DeepAnalysis;
  children?: React.ReactNode;
}) {
  const t = useTranslations("Admin.reports.deep");
  const failed = deep.failures.reduce((sum, f) => sum + f.count, 0);
  const counted = (
    list: Array<{ key: string; count: number }>,
    labelOf: (key: string) => string,
    unit: "orders" | "reviews",
  ) => {
    const most = Math.max(0, ...list.map((c) => c.count));
    return list.map((c) => ({
      key: c.key,
      label: labelOf(c.key),
      value: percent(c.count, most),
      text: t(unit, { count: c.count }),
    }));
  };

  return (
    <>
      <Panel id="report-failures" title={t("failures", { orders: failed })}>
        <Bars
          empty={t("empty")}
          bars={counted(
            deep.failures,
            (key) => (known(failures, key) ? t(`failure.${key}`) : key),
            "orders",
          )}
        />
      </Panel>
      {children}
      <Panel id="report-tags" title={t("tags")}>
        <Bars
          empty={t("empty")}
          bars={counted(deep.tags, (key) => (known(tags, key) ? t(`tag.${key}`) : key), "reviews")}
        />
      </Panel>
      <Panel id="report-problems" title={t("problems")}>
        <Bars
          empty={t("empty")}
          bars={counted(
            deep.problems,
            (key) => (known(problems, key) ? t(`problem.${key}`) : key),
            "orders",
          )}
        />
      </Panel>
    </>
  );
}
