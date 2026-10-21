import { ChevronRightIcon, LeafIcon } from "lucide-react";
import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { savingOf, type Order } from "./order";
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

/** An order still to collect, with the way to its code (Figma W7 › đơn đang chờ). */
async function OpenOrderCard({ order }: { order: Order }) {
  const [t, format] = await Promise.all([getTranslations("Orders"), getFormatter()]);
  const until = format.dateTime(new Date(order.windowEnd), "time");
  const from = format.dateTime(new Date(order.windowStart), "time");

  return (
    <article className="flex flex-col gap-3 rounded-3xl bg-card p-4 text-card-foreground">
      <div className="flex items-start gap-3">
        <Thumb order={order} size="md" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-label text-muted-foreground">{order.seller.name}</p>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-label-strong text-secondary-foreground">
              {order.status === "ready" ? t("readyUntil", { until }) : t("collectFrom", { from })}
            </span>
          </div>
          <h3 className="truncate text-body-sm-strong">
            {order.lines.map((line) => line.name).join(", ")}
          </h3>
          <p className="text-label text-muted-foreground">
            {t("cardLine", { number: order.number, total: formatPrice(order.totalVnd) })}
          </p>
        </div>
      </div>
      <Link
        href={`/orders/${order.id}`}
        className={buttonVariants({ variant: "secondary", size: "lg" })}
      >
        {order.code ? t("seeCode", { code: order.code }) : t("seeOrder")}
      </Link>
    </article>
  );
}

/** An order that has ended, on one line (Figma W7 › Trước đó). */
async function EndedOrderRow({ order }: { order: Order }) {
  const [t, format] = await Promise.all([getTranslations("Orders"), getFormatter()]);
  const at = new Date(order.windowStart);

  return (
    <li>
      <Link
        href={`/orders/${order.id}`}
        className="flex items-center gap-3 rounded-2xl bg-card p-3 text-card-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Thumb order={order} size="sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-body-sm-strong">
            {order.lines.map((line) => line.name).join(", ")}
          </p>
          <p className="flex flex-wrap items-center gap-2 text-label text-muted-foreground">
            {t("date", {
              day: format.dateTime(at, "dayOfMonth"),
              month: format.dateTime(at, "monthOfYear"),
            })}
            <OrderStatusChip status={order.status} />
          </p>
        </div>
        <ChevronRightIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  );
}

/**
 * "Đơn của tôi" (Figma W7): the two lists as tabs with their counts; the orders to collect as cards with the
 * way to their code, then the latest that have ended; beside them, what the customer's collected orders saved.
 */
export async function MyOrders({ which: pending }: { which: Promise<Which> }) {
  const which = await pending;
  const [t, open, done] = await Promise.all([
    getTranslations("Orders"),
    readMyOrders("open"),
    readMyOrders("ended"),
  ]);
  if (!open.signedIn || !done.signedIn) return <SignInPrompt returnTo="/orders" />;

  const collected = done.value.filter((order) => order.status === "collected");
  const saved = collected.reduce((sum, order) => sum + savingOf(order), 0);
  const ended = which === "open" ? done.value.slice(0, 3) : done.value;

  return (
    <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
      <div className="flex flex-col gap-4 lg:col-span-3">
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
                ? t("tabOpen", { count: open.value.length })
                : t("tabEnded", { count: done.value.length })}
            </Link>
          ))}
        </nav>
        {which === "open" ? (
          open.value.length > 0 ? (
            open.value.map((order) => <OpenOrderCard key={order.id} order={order} />)
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
              {ended.map((order) => (
                <EndedOrderRow key={order.id} order={order} />
              ))}
            </ul>
          </section>
        ) : which === "ended" ? (
          <p className="rounded-3xl bg-card p-6 text-center text-body-sm text-muted-foreground">
            {t("noneEnded")}
          </p>
        ) : null}
      </div>
      <aside className="flex items-start gap-3 rounded-3xl bg-primary p-5 text-primary-foreground lg:col-span-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fresh text-fresh-foreground">
          <LeafIcon aria-hidden className="size-5" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-title">
            {collected.length > 0 ? t("impact", { meals: collected.length }) : t("impactNone")}
          </p>
          <p className="text-body-sm text-inverse-muted">
            {collected.length > 0
              ? t("impactSaved", { saved: formatPrice(saved) })
              : t("impactNoneBody")}
          </p>
        </div>
      </aside>
    </div>
  );
}
