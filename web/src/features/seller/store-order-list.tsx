import { getTranslations } from "next-intl/server";

import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { getStoreOrders } from "./my-sellers";
import { OrderRow } from "./order-row";
import { OrdersFilter } from "./orders-filter";
import { requireStore } from "./require-store";
import {
  deliveredTotal,
  groupOrders,
  matchesQuery,
  type OrderTab,
  orderTabs,
  readDay,
  readOrderTab,
  unitsOf,
  vietnamToday,
} from "./store-orders";
import { UndoToast } from "./undo-toast";

// The store's order tab (SEC-78, Figma Q5, Q5b to Q5g): the orders of one day, which customers hold with their
// name and phone number, in three tabs — held, handed over, cancelled — with a search and a day to pick. The customer
// pays the seller in cash at the counter, so "Đã giao" ends an order. It reads the session, so it renders inside Suspense.
export async function StoreOrders({
  sellerId: pendingId,
  query: pendingQuery,
}: {
  sellerId: Promise<string>;
  query: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sellerId = await pendingId;
  const query = await pendingQuery;
  const one = (name: string) => (typeof query[name] === "string" ? query[name] : undefined);

  // The session is read before the clock, so the page is made for each request and never at build time.
  await requireStore(sellerId, `/stores/${sellerId}/orders`);

  const today = vietnamToday();
  const day = readDay(one("day"), today);
  const tab = readOrderTab(one("tab"));
  const search = (one("q") ?? "").trim().slice(0, 80);

  const [t, orders] = await Promise.all([
    getTranslations("StoreOrders"),
    getStoreOrders(sellerId, day),
  ]);

  // The day's orders are few, so the search reads them here rather than asking the server again.
  const found = orders.filter((order) => matchesQuery(order, search));
  const groups = groupOrders(found);
  const shown = groups[tab];
  const searching = search !== "";

  const delivered = groups.delivered;
  let summary: string;
  if (searching) summary = t("searchCount", { count: found.length });
  else if (tab === "holding") {
    const holding = groups.holding;
    summary = t("summaryHolding", {
      units: holding.reduce((sum, order) => sum + unitsOf(order), 0),
      people: new Set(holding.map((order) => order.customerPhone)).size,
    });
  } else if (tab === "delivered") {
    summary = t("summaryDelivered", {
      count: delivered.length,
      amount: formatPrice(deliveredTotal(delivered)),
    });
  } else summary = t("summaryCancelled", { count: groups.cancelled.length });

  const undoId = one("undo");
  const undone = undoId ? orders.find((order) => order.id === undoId) : undefined;
  const undoMessage = undone ? t("deliveredTo", { name: undone.customerName }) : undefined;

  const tabHref = (name: OrderTab) => ({
    pathname: `/stores/${sellerId}/orders`,
    query: {
      ...(day === today ? {} : { day }),
      ...(name === "holding" ? {} : { tab: name }),
      ...(searching ? { q: search } : {}),
    },
  });

  return (
    <>
      {undone && undoMessage && <UndoToast orderId={undone.id} message={undoMessage} />}
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-page-title text-foreground">{t("title")}</h1>
        <p className="text-body-sm text-muted-foreground">{summary}</p>
      </div>

      <OrdersFilter sellerId={sellerId} day={day} today={today} tab={tab} q={search} />

      <section
        aria-label={t("title")}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-card-foreground"
      >
        <nav aria-label={t("tabs")}>
          <ul className="-my-1 flex flex-wrap gap-x-2">
            {orderTabs.map((name) => (
              <li key={name}>
                <Link
                  href={tabHref(name)}
                  aria-current={name === tab ? "page" : undefined}
                  className="group/chip flex min-h-11 items-center rounded-full focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      "flex h-9.5 items-center rounded-full border px-4 whitespace-nowrap transition-colors",
                      name === tab
                        ? "border-primary bg-primary text-body-sm-strong text-primary-foreground"
                        : "border-border bg-card text-body-sm text-foreground group-hover/chip:bg-secondary",
                    )}
                  >
                    {t(`tab.${name}`, { count: groups[name].length })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {shown.length === 0 ? (
          <p className="border-t border-border pt-4 text-body-sm text-muted-foreground">
            {searching ? t("emptySearch", { query: search }) : t(`empty.${tab}`)}
          </p>
        ) : (
          <ul className="flex flex-col border-t border-border">
            {shown.map((order) => (
              <OrderRow key={order.id} order={order} tab={tab} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
