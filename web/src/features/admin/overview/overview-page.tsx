import { getFormatter, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

import { mergeActivity } from "./activity";
import { ActivityCard } from "./activity-card";
import { DailyChart } from "./daily-chart";
import { dailySeries } from "./daily-series";
import { readOverviewRange } from "./overview-range";
import { readOverview } from "./overview-source";
import { RangeControl } from "./range-control";
import { TodoCard } from "./todo-card";
import { TopSellersCard } from "./top-sellers-card";

/** How many of the newest stores and posts the recent activity lists (Figma AD-TQ1 draws five). */
const activityLength = 5;

type Figure = { label: string; value: ReactNode | null; unit?: ReactNode };

/**
 * The dashboard (Figma AD-TQ1, AD-TQ2) on `GET /admin/summary`: the span, the figures, posts by day, what waits,
 * the stores that posted most and the newest activity. The figures that need orders show "—" until SEC-15.
 */
export async function OverviewPage({ query }: { query: Promise<Record<string, unknown>> }) {
  const range = readOverviewRange((await query).range);
  const [{ summary, chart, orders, pending }, shell, t, format] = await Promise.all([
    readOverview(range),
    getTranslations("admin.shell"),
    getTranslations("admin.overview"),
    getFormatter(),
  ]);
  const { sellers, offers, accounts } = summary;
  const noData = t("figures.noData");
  const number = (value: number) => format.number(value);

  // Each figure's name, then its number with its unit beside it ("42 đơn"). A figure the backend cannot give
  // yet (`value` null) shows "—" and the words for no data, never a zero that reads as a measurement.
  const figures: Figure[] = [
    {
      label: t("figures.orders"),
      value: orders.orders === null ? null : number(orders.orders),
      unit: t("units.orders", { count: orders.orders ?? 0 }),
    },
    {
      label: t("figures.portionsSaved"),
      value: orders.portionsSaved === null ? null : number(orders.portionsSaved),
      unit: t("units.portions", { count: orders.portionsSaved ?? 0 }),
    },
    {
      label: t("figures.collected"),
      value:
        orders.collected === null || orders.collected.of === 0
          ? null
          : `${Math.round((orders.collected.count / orders.collected.of) * 100)}%`,
      unit: orders.collected && t("units.collectedOf", orders.collected),
    },
    {
      label: t("figures.activeSellers"),
      value: number(sellers.active),
      unit: t("units.sellersOf", {
        total: number(sellers.active + sellers.pending + sellers.blocked),
      }),
    },
    {
      label: t("figures.posted"),
      value: number(offers.postedInRange),
      unit: t("units.posts", { count: offers.postedInRange }),
    },
    {
      label: t("figures.unitsPosted"),
      value: number(offers.unitsPostedInRange),
      unit: t("units.units", { count: offers.unitsPostedInRange }),
    },
    {
      label: t("figures.onSale"),
      value: number(offers.onSaleNow),
      unit: t("units.posts", { count: offers.onSaleNow }),
    },
    {
      label: t("figures.newAccounts"),
      value: number(accounts.newInRange),
      unit: t("units.accounts", { count: accounts.newInRange }),
    },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-page-title text-foreground">{shell("pages.overview.label")}</h1>
        <RangeControl />
      </div>
      <section
        aria-label={t("figures.label")}
        className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"
      >
        {figures.map(({ label, value, unit }) => (
          <Card key={label} className="min-w-0">
            <CardHeader>
              <CardDescription>{label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="font-display text-display text-foreground">
                  {value === null ? "—" : value}
                </span>
                <span
                  className={
                    value === null
                      ? "text-body-sm text-muted-foreground"
                      : "text-body-sm-strong text-foreground"
                  }
                >
                  {value === null ? noData : unit}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      <div className="flex flex-col gap-4 lg:flex-row">
        <DailyChart points={dailySeries(chart.offers.postedPerDay, chart.accounts.newPerDay)} />
        <div className="lg:w-92 lg:shrink-0">
          <TodoCard
            counts={{
              ...pending,
              pendingSellers: sellers.pending,
              blockedSellers: sellers.blocked,
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopSellersCard sellers={offers.topSellers} />
        <ActivityCard activity={mergeActivity(sellers.latest, offers.latest, activityLength)} />
      </div>
    </>
  );
}
