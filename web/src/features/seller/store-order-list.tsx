import { getTranslations } from "next-intl/server";

import { formatPrice } from "@/features/offers/format";
import { LiveRefresh } from "@/features/orders/live-refresh";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { getStoreOrders } from "./my-sellers";
import { OrderRow } from "./order-row";
import { DayFilter } from "./day-filter";
import { ScanOrder } from "./scan-order";
import { requireStore } from "./require-store";
import {
  deliveredTotal,
  groupOrders,
  matchesQuery,
  type OrderTab,
  orderTabs,
} from "./store-orders";
import {
  dayOrNull,
  loadOrderSearchParams,
  searchOf,
  serializeOrderSearchParams,
} from "./search-params";
import { vietnamToday } from "./store-day";
import { StoreTitleRow } from "./store-title-row";
import { UndoToast } from "./undo-toast";

// The store's order tab (SEC-78, Figma Q5, Q5b to Q5g): the orders of one day, which customers hold with their
// name and phone number, in four tabs — preparing, ready, handed over, cancelled — with a search and a day to pick
// (SEC-102 added the two steps). The customer pays the seller in cash at the counter, so "Đã giao" ends an order. It
// reads the session, so it renders inside Suspense.
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
  const filter = loadOrderSearchParams(query);
  const day = filter.day ?? today;
  const { tab } = filter;
  const search = searchOf(filter.q);

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
  else if (tab === "preparing" || tab === "ready") {
    summary = t("summaryHolding", {
      preparing: groups.preparing.length,
      ready: groups.ready.length,
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

  const tabHref = (name: OrderTab) =>
    `/stores/${sellerId}/orders${serializeOrderSearchParams({ day: dayOrNull(day, today), tab: name, q: search })}`;

  return (
    <>
      <LiveRefresh topics={[`seller:${sellerId}`]} />
      {undone && undoMessage && <UndoToast orderId={undone.id} message={undoMessage} />}
      <StoreTitleRow
        title={t("title")}
        baseline
        aside={
          <p className="text-body-sm text-muted-foreground max-md:text-right max-md:text-header-foreground">
            {summary}
          </p>
        }
      />

      <DayFilter
        pathname={`/stores/${sellerId}/orders`}
        list="orders"
        today={today}
        label={t("searchLabel")}
        placeholder={t("searchPlaceholder")}
        extra={<ScanOrder sellerId={sellerId} />}
      />

      <section
        aria-label={t("title")}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-card-foreground"
      >
        <nav aria-label={t("tabs")}>
          <ul className="-my-1 flex flex-wrap gap-x-2 max-md:grid max-md:grid-cols-4 max-md:gap-x-1.5">
            {orderTabs.map((name) => (
              <li key={name}>
                <Link
                  href={tabHref(name)}
                  aria-current={name === tab ? "page" : undefined}
                  className="group/chip flex min-h-11 items-center rounded-full focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none max-md:rounded-2xl"
                >
                  <span
                    className={cn(
                      "flex h-9.5 items-center gap-1.5 rounded-full border px-4 whitespace-nowrap transition-colors max-md:h-auto max-md:min-h-11 max-md:w-full max-md:flex-col max-md:justify-center max-md:gap-0 max-md:rounded-2xl max-md:px-1 max-md:py-1",
                      name === tab
                        ? "border-primary bg-primary text-body-sm-strong text-primary-foreground"
                        : "border-border bg-card text-body-sm text-foreground group-hover/chip:bg-secondary",
                    )}
                  >
                    <span className="max-md:text-note">{t(`tab.${name}`)}</span>
                    {/* The dot is read, so the name of the link is "Chuẩn bị · 3" as ever; a phone stacks the count under the word. */}
                    <span className="max-md:sr-only">·</span>
                    <span className="max-md:text-body-sm-strong">{groups[name].length}</span>
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
