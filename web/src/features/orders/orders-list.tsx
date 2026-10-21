import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { getFormatter, getTimeZone, getTranslations } from "next-intl/server";

import { BiteCorner } from "@/components/bite-corner";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { byCheckout, dayOf, isOpen, type Day, type Order } from "./order";
import { readMyOrderLists } from "./read-orders";
import { SignInPrompt } from "./sign-in-prompt";

export type Which = "open" | "ended";

/** The list the page shows: those still to collect unless the address asks for the ended ones. */
export function readWhich(value: unknown): Which {
  return value === "ended" ? "ended" : "open";
}

function Thumb({ order, size }: { order: Order; size: "md" | "sm" }) {
  const photo = order.lines[0]?.photo;
  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden bg-muted",
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
  );
}

/** What a group of orders placed together shows as one: its sellers, dishes, numbers and total. */
function together(orders: Order[]) {
  return {
    sellers: orders.map((order) => order.seller.name).join(", "),
    dishes: orders.flatMap((order) => order.lines.map((line) => line.name)),
    numbers: orders.map((order) => order.number).join(", "),
    total: orders.reduce((sum, order) => sum + order.totalVnd, 0),
  };
}

/** The dishes of a group, each on its own line. */
function Dishes({ dishes, className }: { dishes: string[]; className: string }) {
  return (
    <span className={cn("flex flex-col", className)}>
      {dishes.map((dish, index) => (
        <span key={index} className="truncate">
          {dish}
        </span>
      ))}
    </span>
  );
}

/**
 * Orders still to collect, placed together from one cart (SEC-76 › decision 8), with the way to them (Figma
 * D1 › active): the soonest part decides the status and the window shown.
 */
async function OpenOrderCard({ orders }: { orders: Order[] }) {
  const [t, format] = await Promise.all([getTranslations("Orders"), getFormatter()]);
  const [order] = orders
    .filter(isOpen)
    .toSorted((a, b) => Date.parse(a.windowStart) - Date.parse(b.windowStart));
  const from = format.dateTime(new Date(order.windowStart), "time");
  const until = format.dateTime(new Date(order.windowEnd), "time");
  const { sellers, dishes, numbers, total } = together(orders);

  return (
    <article className="relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-card p-3.5 text-card-foreground">
      <BiteCorner className="size-12" />
      <div className="flex items-center gap-3">
        <Thumb order={order} size="md" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="flex items-center justify-between gap-2 pr-6 text-label">
            <span className="truncate text-muted-foreground">{sellers}</span>
            <span className="shrink-0 text-label-strong text-primary">
              {order.status === "ready" ? t("readyUntil", { until }) : t("preparing")}
            </span>
          </p>
          <h3>
            <Dishes dishes={dishes} className="text-title" />
          </h3>
          <p className="text-label text-muted-foreground">
            {t("cardMeta", { numbers, from, until })}
          </p>
          <p className="flex items-baseline gap-1.5 text-label text-muted-foreground">
            <span className="font-display text-price text-foreground">{formatPrice(total)}</span>
            {t("payOnCollect")}
          </p>
        </div>
      </div>
      <Link
        href={`/orders/${orders[0].id}`}
        className={buttonVariants({ variant: "secondary", size: "lg" })}
      >
        {t("seeOrder")}
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

/** Orders placed together that have all ended, on one line (Figma D4 › past): their day and what became of them. */
async function EndedOrderRow({ orders }: { orders: Order[] }) {
  const [t, format] = await Promise.all([getTranslations("Orders"), getFormatter()]);
  const [order] = orders;
  const at = new Date(order.windowStart);
  const { sellers, dishes } = together(orders);
  const collected = orders.filter(({ status }) => status === "collected");
  const date = t("date", {
    day: format.dateTime(at, "dayOfMonth"),
    month: format.dateTime(at, "monthOfYear"),
  });
  const outcomes = [...new Set(orders.map(({ status }) => t(`endedLine.${status}`)))];
  const paid = collected.reduce((sum, { totalVnd }) => sum + totalVnd, 0);
  const meta = [
    ...(collected.length > 0 ? [sellers] : []),
    date,
    ...outcomes,
    ...(paid > 0 ? [formatPrice(paid)] : []),
  ];

  return (
    <li>
      <Link
        href={`/orders/${order.id}`}
        className="flex items-center gap-3 rounded-2xl bg-card p-3 text-card-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Thumb order={order} size="sm" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Dishes dishes={dishes} className="text-body-sm-strong" />
          <span className={cn("text-label", endedTone[order.status])}>{meta.join(" · ")}</span>
        </span>
        <ChevronRightIcon aria-hidden className="size-4.5 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  );
}

const days: Day[] = ["today", "week", "before"];

/**
 * "Đơn của tôi" (Figma D1, D4): the two lists as a segmented control; the orders to collect as cards with the
 * way to them, and once some were collected what they saved; the ended ones under their day.
 */
export async function MyOrders({ which: pending }: { which: Promise<Which> }) {
  const which = await pending;
  const [t, timeZone, lists] = await Promise.all([
    getTranslations("Orders"),
    getTimeZone(),
    readMyOrderLists(),
  ]);
  if (!lists.known) return <SignInPrompt returnTo="/orders" />;
  const { open, ended, now } = lists.value;

  // Orders placed together are one, still to collect while any of them is (SEC-76 › decision 8).
  const groups = byCheckout([...open, ...ended]);
  const openGroups = groups.filter((group) => group.some(isOpen));
  const endedGroups = groups.filter((group) => !group.some(isOpen));
  const endedByDay = days
    .map((day) => ({
      day,
      groups: endedGroups.filter((group) => dayOf(group[0].windowStart, now, timeZone) === day),
    }))
    .filter(({ groups }) => groups.length > 0);

  return (
    <>
      <div className="bg-card">
        <nav aria-label={t("lists")} className="mx-auto w-full max-w-xl px-4 py-3">
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
                {tab === "open" ? t("tabOpen", { count: openGroups.length }) : t("tabEnded")}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-4">
        {which === "open" ? (
          <>
            {openGroups.length > 0 ? (
              openGroups.map((group) => <OpenOrderCard key={group[0].id} orders={group} />)
            ) : (
              <p className="rounded-2xl bg-card p-6 text-center text-body-sm text-muted-foreground">
                {t("noneOpen")}
              </p>
            )}
          </>
        ) : endedByDay.length > 0 ? (
          endedByDay.map(({ day, groups: inDay }) => (
            <section key={day} aria-labelledby={`orders-${day}`} className="flex flex-col gap-2.5">
              <h2 id={`orders-${day}`} className="text-title">
                {t(`day.${day}`)}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {inDay.map((group) => (
                  <EndedOrderRow key={group[0].id} orders={group} />
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
    </>
  );
}
