import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { getFormatter, getTimeZone, getTranslations } from "next-intl/server";

import { BiteCorner } from "@/components/bite-corner";
import { buttonVariants } from "@/components/ui/button";
import { UnreadPill } from "@/components/unread-pill";
import { formatPrice } from "@/features/offers/format";
import { listOffers } from "@/features/offers/list-offers";
import { TonightOffers } from "@/features/offers/tonight-offers";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { LiveRefresh } from "./live-refresh";
import { dayOf, dishesOf, type Day, type Order } from "./order";
import { readMyOrderLists } from "./read-orders";
import { SignInPrompt } from "./sign-in-prompt";

export type Which = "open" | "ended";

/** The list the page shows: those still to collect unless the address asks for the ended ones. */
export function readWhich(value: unknown): Which {
  return value === "ended" ? "ended" : "open";
}

/** The order's first dish; the count of messages not read yet sits at its top right (SEC-117). */
function Thumb({ order, size }: { order: Order; size: "md" | "sm" }) {
  const photo = order.lines[0]?.photo;
  return (
    <span className="relative shrink-0">
      <span
        className={cn(
          "relative block overflow-hidden bg-muted",
          size === "md" ? "size-18 rounded-lg" : "size-13 rounded-md",
        )}
      >
        {photo ? (
          <Image
            src={`/api${photo.smallPath}`}
            alt=""
            fill
            sizes={size === "md" ? "72px" : "52px"}
            unoptimized
            className="object-cover"
          />
        ) : null}
      </span>
      <UnreadPill count={order.unreadMessages ?? 0} className="absolute -top-1.5 -right-1.5" />
    </span>
  );
}

/**
 * A seller's order still to collect, with the way to it (Figma K8 › active): the seller and when to collect, the
 * dishes, the number, the total and the counter.
 */
async function OpenOrderCard({ order }: { order: Order }) {
  const [t, format] = await Promise.all([getTranslations("Orders"), getFormatter()]);
  const from = format.dateTime(new Date(order.windowStart), "time");
  const until = format.dateTime(new Date(order.windowEnd), "time");

  return (
    <article className="relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-card p-3.5 text-card-foreground">
      <BiteCorner className="size-12" />
      <div className="flex items-center gap-3">
        <Thumb order={order} size="md" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="flex items-center justify-between gap-2 pr-6">
            <span className="truncate text-label text-muted-foreground">{order.seller.name}</span>
            {order.status === "ready" ? (
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.75 text-label-strong text-primary">
                {t("readyUntil", { until })}
              </span>
            ) : (
              <span className="shrink-0 text-label-strong text-primary">{t("preparing")}</span>
            )}
          </p>
          <h3 className="line-clamp-2 text-title">{dishesOf(order)}</h3>
          <p className="text-label text-muted-foreground">
            {order.status === "ready"
              ? t("cardMetaReady", { number: order.number, total: formatPrice(order.totalVnd) })
              : t("cardMetaWindow", {
                  number: order.number,
                  total: formatPrice(order.totalVnd),
                  from,
                  until,
                })}
          </p>
        </div>
      </div>
      <Link
        href={`/orders/${order.id}`}
        className={buttonVariants({ variant: "secondary", size: "lg" })}
      >
        {order.status === "ready" ? t("seeQr") : t("seeOrder")}
      </Link>
    </article>
  );
}

// The colour of an ended order's line under its dishes, beside the words that say its status (Figma D4).
const endedTone: Record<Order["status"], string> = {
  confirmed: "text-muted-foreground",
  ready: "text-muted-foreground",
  collected: "text-muted-foreground",
  cancelled: "text-destructive",
  refused: "text-destructive",
  expired: "text-warning-foreground",
};

/** A seller's order that has ended, on one line (Figma K8 › past): its day, what became of it and what it cost. */
async function EndedOrderRow({ order }: { order: Order }) {
  const [t, format] = await Promise.all([getTranslations("Orders"), getFormatter()]);
  const at = new Date(order.windowStart);
  const date = t("date", {
    day: format.dateTime(at, "dayOfMonth"),
    month: format.dateTime(at, "monthOfYear"),
  });
  const meta = [
    ...(order.status === "collected" ? [order.seller.name] : []),
    date,
    t(`endedLine.${order.status}`),
    ...(order.status === "collected" ? [formatPrice(order.totalVnd)] : []),
  ];

  return (
    <li>
      <Link
        href={`/orders/${order.id}`}
        className="flex h-full items-center gap-3 rounded-2xl bg-card p-3 text-card-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Thumb order={order} size="sm" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-body-sm-strong">{dishesOf(order)}</span>
          <span className={cn("text-label", endedTone[order.status])}>{meta.join(" · ")}</span>
        </span>
        <ChevronRightIcon aria-hidden className="size-4.5 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  );
}

const days: Day[] = ["today", "week", "before"];
// A phone's column, wider on a tablet; from 1024px the page's grid sets the width, 1168px in all.
const COLUMN_WIDTH = "max-w-xl md:max-w-3xl lg:max-w-none lg:px-0";
/**
 * "Đơn của tôi" (Figma K8, D6): the two lists as a segmented control; each seller's order to collect as a card with
 * the way to it, two abreast on a tablet; the ended ones under their day. From 1024px the lists take two thirds
 * and tonight's offers the third beside them.
 */
export async function MyOrders({ which: pending }: { which: Promise<Which> }) {
  const which = await pending;
  const [t, timeZone, lists, offers] = await Promise.all([
    getTranslations("Orders"),
    getTimeZone(),
    readMyOrderLists(),
    // The offers only suggest more to order, so the orders show without them if they cannot be read.
    listOffers({}).catch(() => []),
  ]);
  if (!lists.known) return <SignInPrompt returnTo="/orders" />;
  const { open, ended, now } = lists.value;

  // Each seller's order is its own, even when placed together with others (SEC-97 › decision 4).
  const endedByDay = days
    .map((day) => ({
      day,
      orders: ended.filter((order) => dayOf(order.windowStart, now, timeZone) === day),
    }))
    .filter(({ orders }) => orders.length > 0);

  return (
    <div className="lg:mx-auto lg:flex lg:w-full lg:max-w-300 lg:items-start lg:gap-6 lg:px-4 lg:py-4">
      <LiveRefresh
        topics={open.map((order) => `order:${order.id}`)}
        at={open.map((order) => order.windowEnd)}
      />
      <div className="lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:gap-4">
        <nav
          aria-label={t("lists")}
          className={cn("mx-auto w-full px-4 py-3 lg:p-0", COLUMN_WIDTH)}
        >
          <div className="grid grid-cols-2 rounded-lg bg-secondary p-1">
            {(["open", "ended"] as const).map((tab) => (
              <Link
                key={tab}
                href={
                  tab === "open" ? "/orders" : { pathname: "/orders", query: { state: "ended" } }
                }
                aria-current={tab === which ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center justify-center rounded-md text-body-sm focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
                  tab === which
                    ? "bg-card text-body-sm-strong text-primary shadow-card"
                    : "text-muted-foreground",
                )}
              >
                {tab === "open" ? t("tabOpen", { count: open.length }) : t("tabEnded")}
              </Link>
            ))}
          </div>
        </nav>
        <div className={cn("mx-auto flex w-full flex-col gap-4 px-4 py-4 lg:py-0", COLUMN_WIDTH)}>
          {which === "open" ? (
            <>
              {open.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                  {open.map((order) => (
                    <OpenOrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl bg-card p-6 text-center text-body-sm text-muted-foreground">
                  {t("noneOpen")}
                </p>
              )}
            </>
          ) : endedByDay.length > 0 ? (
            endedByDay.map(({ day, orders }) => (
              <section
                key={day}
                aria-labelledby={`orders-${day}`}
                className="flex flex-col gap-2.5"
              >
                <h2 id={`orders-${day}`} className="text-title">
                  {t(`day.${day}`)}
                </h2>
                <ul className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-1">
                  {orders.map((order) => (
                    <EndedOrderRow key={order.id} order={order} />
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <p className="rounded-2xl bg-card p-6 text-center text-body-sm text-muted-foreground">
              {t("noneEnded")}
            </p>
          )}
        </div>
      </div>
      <TonightOffers offers={offers} className="lg:w-100 lg:shrink-0" />
    </div>
  );
}
