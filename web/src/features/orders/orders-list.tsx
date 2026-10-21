import { ChevronRightIcon, LeafIcon } from "lucide-react";
import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { byCheckout, isOpen, savingOf, type Order } from "./order";
import { OrderStatusChip } from "./order-status";
import { readMyOrders } from "./read-orders";
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
        size === "md" ? "size-18 rounded-2xl" : "size-12 rounded-xl",
      )}
    >
      {photo ? (
        <Image
          src={`/api${photo.smallPath}`}
          alt=""
          fill
          sizes={size === "md" ? "72px" : "48px"}
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

/**
 * Orders still to collect, placed together from one cart (SEC-76 › decision 8), with the way to them (Figma W7
 * › đơn đang chờ): the soonest part decides the time shown, and one order alone shows its code.
 */
async function OpenOrderCard({ orders }: { orders: Order[] }) {
  const [t, format] = await Promise.all([getTranslations("Orders"), getFormatter()]);
  const [order] = orders
    .filter(isOpen)
    .toSorted((a, b) => Date.parse(a.windowStart) - Date.parse(b.windowStart));
  const until = format.dateTime(new Date(order.windowEnd), "time");
  const from = format.dateTime(new Date(order.windowStart), "time");
  const { sellers, dishes, numbers, total } = together(orders);
  const code = orders.length === 1 ? order.code : undefined;

  return (
    <article className="flex flex-col gap-3 rounded-3xl bg-card p-4 text-card-foreground">
      <div className="flex items-start gap-3">
        <Thumb order={order} size="md" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-label text-muted-foreground">{sellers}</p>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-label-strong text-secondary-foreground">
              {order.status === "ready" ? t("readyUntil", { until }) : t("collectFrom", { from })}
            </span>
          </div>
          <h3 className="flex flex-col text-body-sm-strong">
            {dishes.map((dish, index) => (
              <span key={index} className="truncate">
                {dish}
              </span>
            ))}
          </h3>
          <p className="text-label text-muted-foreground">{numbers}</p>
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
        {code ? t("seeCode", { code }) : t("seeOrder")}
      </Link>
    </article>
  );
}

/** Orders placed together that have all ended, on one line (Figma W7 › Trước đó), with each status once. */
async function EndedOrderRow({ orders }: { orders: Order[] }) {
  const [t, format] = await Promise.all([getTranslations("Orders"), getFormatter()]);
  const [order] = orders;
  const at = new Date(order.windowStart);
  const statuses = [...new Set(orders.map(({ status }) => status))];

  return (
    <li>
      <Link
        href={`/orders/${order.id}`}
        className="flex items-center gap-3 rounded-2xl bg-card p-3 text-card-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Thumb order={order} size="sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="flex flex-col text-body-sm-strong">
            {together(orders).dishes.map((dish, index) => (
              <span key={index} className="truncate">
                {dish}
              </span>
            ))}
          </p>
          <p className="flex flex-wrap items-center gap-2 text-label text-muted-foreground">
            {t("date", {
              day: format.dateTime(at, "dayOfMonth"),
              month: format.dateTime(at, "monthOfYear"),
            })}
            {statuses.map((status) => (
              <OrderStatusChip key={status} status={status} />
            ))}
          </p>
        </div>
        <ChevronRightIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  );
}

/**
 * "Đơn của tôi" (Figma W7): the two lists as tabs with their counts; the orders to collect as cards with the
 * way to their code, then the latest that have ended; beside them, once some were collected, what they saved.
 */
export async function MyOrders({ which: pending }: { which: Promise<Which> }) {
  const which = await pending;
  const [t, open, done] = await Promise.all([
    getTranslations("Orders"),
    readMyOrders("open"),
    readMyOrders("ended"),
  ]);
  if (!open.known || !done.known) return <SignInPrompt returnTo="/orders" />;

  // Orders placed together are one, still to collect while any of them is (SEC-76 › decision 8).
  const groups = byCheckout([...open.value, ...done.value]);
  const openGroups = groups.filter((group) => group.some(isOpen));
  const endedGroups = groups.filter((group) => !group.some(isOpen));
  const collected = done.value.filter((order) => order.status === "collected");
  const saved = collected.reduce((sum, order) => sum + savingOf(order), 0);
  const ended = which === "open" ? endedGroups.slice(0, 3) : endedGroups;

  return (
    <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
      <div className="flex min-w-0 flex-col gap-4 lg:col-span-3">
        <nav
          aria-label={t("lists")}
          className="grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1"
        >
          {(["open", "ended"] as const).map((tab) => (
            <Link
              key={tab}
              href={tab === "open" ? "/orders" : { pathname: "/orders", query: { state: "ended" } }}
              aria-current={tab === which ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center justify-center rounded-xl text-body-sm-strong focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
                tab === which ? "bg-card text-primary" : "text-secondary-foreground",
              )}
            >
              {tab === "open"
                ? t("tabOpen", { count: openGroups.length })
                : t("tabEnded", { count: endedGroups.length })}
            </Link>
          ))}
        </nav>
        {which === "open" ? (
          openGroups.length > 0 ? (
            openGroups.map((group) => <OpenOrderCard key={group[0].id} orders={group} />)
          ) : (
            <p className="rounded-3xl bg-card p-6 text-center text-body-sm text-muted-foreground">
              {t("noneOpen")}
            </p>
          )
        ) : null}
        {ended.length > 0 ? (
          <section aria-labelledby="orders-ended" className="flex flex-col gap-2">
            <h2 id="orders-ended" className={which === "open" ? "text-body-sm-strong" : "sr-only"}>
              {t("before")}
            </h2>
            <ul className="flex flex-col gap-2">
              {ended.map((group) => (
                <EndedOrderRow key={group[0].id} orders={group} />
              ))}
            </ul>
          </section>
        ) : which === "ended" ? (
          <p className="rounded-3xl bg-card p-6 text-center text-body-sm text-muted-foreground">
            {t("noneEnded")}
          </p>
        ) : null}
      </div>
      {collected.length > 0 ? (
        <aside className="flex items-start gap-3 rounded-3xl bg-primary p-5 text-primary-foreground lg:col-span-2">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fresh text-fresh-foreground">
            <LeafIcon aria-hidden className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-title">{t("impact", { meals: collected.length })}</p>
            <p className="text-body-sm text-inverse-muted">
              {t("impactSaved", { saved: formatPrice(saved) })}
            </p>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
