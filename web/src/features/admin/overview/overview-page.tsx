import { getFormatter, getTranslations } from "next-intl/server";

import { PageHeader } from "@/features/admin/ui/page-header";

import { mergeActivity } from "./activity";
import { ActivityCard } from "./activity-card";
import { DailyChart } from "./daily-chart";
import { dailySeries } from "./daily-series";
import { FigureCard } from "./figure-card";
import { readOverviewRange } from "./overview-range";
import { readOverview } from "./overview-source";
import { RangeControl } from "./range-control";
import { TodoCard } from "./todo-card";
import { TopSellersCard } from "./top-sellers-card";

/** How many of the newest stores and posts the recent activity lists (Figma AD-TQ1 draws five). */
const activityLength = 5;

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

  return (
    <>
      <PageHeader title={shell("pages.overview.label")} actions={<RangeControl />} />
      <section
        aria-label={t("figures.label")}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <FigureCard
          label={t("figures.orders")}
          value={orders.orders === null ? null : number(orders.orders)}
          unit={t("units.orders", { count: orders.orders ?? 0 })}
          noData={noData}
        />
        <FigureCard
          label={t("figures.portionsSaved")}
          value={orders.portionsSaved === null ? null : number(orders.portionsSaved)}
          unit={t("units.portions", { count: orders.portionsSaved ?? 0 })}
          noData={noData}
        />
        <FigureCard
          label={t("figures.collected")}
          value={
            orders.collected === null || orders.collected.of === 0
              ? null
              : `${Math.round((orders.collected.count / orders.collected.of) * 100)}%`
          }
          unit={orders.collected && t("units.collectedOf", orders.collected)}
          noData={noData}
        />
        <FigureCard
          label={t("figures.activeSellers")}
          value={number(sellers.active)}
          unit={t("units.sellersOf", {
            total: number(sellers.active + sellers.pending + sellers.blocked),
          })}
          noData={noData}
        />
        <FigureCard
          label={t("figures.posted")}
          value={number(offers.postedInRange)}
          unit={t("units.posts", { count: offers.postedInRange })}
          noData={noData}
        />
        <FigureCard
          label={t("figures.unitsPosted")}
          value={number(offers.unitsPostedInRange)}
          unit={t("units.units", { count: offers.unitsPostedInRange })}
          noData={noData}
        />
        <FigureCard
          label={t("figures.onSale")}
          value={number(offers.onSaleNow)}
          unit={t("units.posts", { count: offers.onSaleNow })}
          noData={noData}
        />
        <FigureCard
          label={t("figures.newAccounts")}
          value={number(accounts.newInRange)}
          unit={t("units.accounts", { count: accounts.newInRange })}
          noData={noData}
        />
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
