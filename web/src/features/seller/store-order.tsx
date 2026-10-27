import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";

import { ChatEntry } from "@/features/chat/chat-entry";
import { UnreadBanner } from "@/features/chat/unread-banner";
import { LiveRefresh } from "@/features/orders/live-refresh";
import { hoursAndMinutes, unitsOf, windowPhase } from "@/features/orders/order";
import { Link } from "@/i18n/navigation";
import type { OrderBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";
import { photoUrl } from "@/lib/api/photo";

import { CopyPhoneButton } from "./copy-phone-button";
import { getStoreOrder } from "./my-sellers";
import { OrderActions, ReopenButton } from "./order-actions";
import { OrderLines } from "./order-lines";
import { OrderTrack } from "./order-track";
import { PhoneFootBar } from "./phone-foot-bar";
import { requireStore } from "./require-store";
import { StoreProblem } from "./store-problem";
import { dayOrNull, serializeOrderSearchParams } from "./search-params";
import { nowMs, vietnamDay, vietnamToday } from "./store-day";
import { endedBecause } from "./store-orders";

// An order's own page for the store (SEC-102, Figma Q5j and Q5k on the web, O2 and O3 on a phone): the blue card
// with where the order stands, the window in large figures and the track of four steps, the customer beside it;
// then the lines, and what the seller can do next. An order that has ended says what ended it instead of the
// track. On a phone it is a pushed screen and the buttons stay fixed at the foot. It reads the session, so it
// renders inside Suspense.
export async function StoreOrder({
  sellerId: pendingId,
  orderId: pendingOrder,
}: {
  sellerId: Promise<string>;
  orderId: Promise<string>;
}) {
  const [sellerId, orderId] = await Promise.all([pendingId, pendingOrder]);

  // The session is read before the clock, so the page is made for each request and never at build time.
  await requireStore(sellerId, `/stores/${sellerId}/orders/${orderId}`);
  const [t, format, order] = await Promise.all([
    getTranslations("StoreOrders"),
    getFormatter(),
    getStoreOrder(orderId),
  ]);
  if (!order || order.seller.id !== sellerId) notFound();

  const now = nowMs();
  const time = (value: string) => format.dateTime(new Date(value), "time");
  const open = order.status === "confirmed" || order.status === "ready";
  const tracked = open || order.status === "collected";
  const why = endedBecause(order);

  const duration = (milliseconds: number) => {
    const { hours, minutes } = hoursAndMinutes(milliseconds);
    return hours > 0
      ? t("detail.hoursMinutes", { hours, minutes })
      : t("detail.minutes", { minutes });
  };
  const phase = windowPhase(order, now);
  let sub = "";
  if (order.status === "collected") {
    sub = t("detail.collectedAt", { time: time(order.collectedAt ?? order.windowEnd) });
  } else if (!open) {
    if (why === "customer" || why === "expired") sub = t(`ended.${why}`);
    else if (why) {
      sub = order.refuseNote
        ? t("ended.note", { reason: t(`reason.${why}`), note: order.refuseNote })
        : t("ended.reason", { reason: t(`reason.${why}`) });
    }
  } else if (phase === "before") {
    sub = t("detail.opensIn", { left: duration(Date.parse(order.windowStart) - now) });
  } else if (phase === "open") {
    sub = t("detail.closesIn", { left: duration(Date.parse(order.windowEnd) - now) });
  } else sub = t("detail.over", { until: time(order.windowEnd) });

  // Back to the list on the day the order is collected, which is today unless the seller came from another day.
  const day = vietnamDay.format(new Date(order.windowStart));
  const list = `/stores/${sellerId}/orders${serializeOrderSearchParams({ day: dayOrNull(day, vietnamToday()) })}`;

  const [first] = order.lines;
  const muted = tracked ? "text-inverse-muted" : "text-muted-foreground";

  return (
    <>
      <LiveRefresh
        topics={[`seller:${sellerId}`]}
        orderIds={[order.id]}
        at={[order.windowStart, order.windowEnd]}
      />
      <div className="flex flex-col gap-4 max-md:mb-28">
        <Link
          href={list}
          className="-mb-2 flex min-h-11 w-fit items-center gap-1 rounded-lg text-body-sm-strong text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring max-md:hidden"
        >
          <ChevronLeftIcon aria-hidden className="size-4" />
          {t("detail.back")}
        </Link>

        <UnreadBanner
          orderId={order.id}
          side="seller"
          unread={order.unreadMessages}
          href={`/stores/${sellerId}/orders/${order.id}/chat`}
        />

        <section
          aria-labelledby={`store-order-${order.id}`}
          className={cn(
            "grid gap-6 rounded-3xl p-5 md:grid-cols-5 md:items-center md:p-8",
            tracked ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground",
          )}
        >
          <div className="flex flex-col gap-2 md:col-span-3">
            <p className={cn("text-label", muted)}>
              {t("detail.meta", { number: order.number, time: time(order.createdAt) })}
            </p>
            <h1
              id={`store-order-${order.id}`}
              className={cn("text-body-sm-strong", tracked ? "text-fresh" : "text-destructive")}
            >
              {t(`detail.headline.${order.status}`)}
            </h1>
            <p className="font-display text-display">
              {time(order.windowStart)} – {time(order.windowEnd)}
            </p>
            {sub && <p className={cn("text-body-sm", muted)}>{sub}</p>}
            {tracked && <OrderTrack order={order} />}
          </div>
          <div className="md:col-span-2">
            <section
              aria-label={t("detail.customer")}
              className="flex flex-col gap-4 rounded-3xl bg-card p-5 text-card-foreground"
            >
              <div className="flex items-center gap-3">
                <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={photoUrl(first.photo.smallPath)}
                    alt=""
                    fill
                    sizes="40px"
                    unoptimized
                    className="object-cover"
                  />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-body-sm-strong">{order.customerName}</p>
                  <p className="flex items-center gap-2 text-label text-muted-foreground">
                    <span>{order.customerPhone}</span>
                    <CopyPhoneButton phone={order.customerPhone} />
                  </p>
                </div>
                <span className="shrink-0 text-label-strong text-primary">
                  {t("detail.units", { count: unitsOf(order) })}
                </span>
              </div>
              {open && (
                <p className="border-t border-dashed border-border pt-4 text-body-sm text-muted-foreground">
                  {t(`detail.hint.${order.status === "ready" ? "ready" : "confirmed"}`)}
                </p>
              )}
            </section>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-3">
            <OrderLines order={order} />
          </div>
          <div className="flex flex-col gap-3 lg:col-span-2">
            <StoreProblem order={order} />
            <Next order={order} list={`/stores/${sellerId}/orders`} />
            <ChatEntry
              order={order}
              side="seller"
              href={`/stores/${sellerId}/orders/${order.id}/chat`}
              variant="outline"
            />
          </div>
        </div>
      </div>
    </>
  );
}

/** What the seller can do with the order now: the next step and cancelling, or taking a mistake back (Figma Q5j, Q5k). */
export async function Next({ order, list }: { order: OrderBody; list: string }) {
  const t = await getTranslations("StoreOrders.detail");
  const stage =
    order.status === "confirmed" ? "preparing" : order.status === "ready" ? "ready" : undefined;
  const takeBack = order.status === "collected" || order.status === "refused";
  if (!stage && !takeBack) return null;

  return (
    <section
      aria-labelledby={`order-next-${order.id}`}
      className="flex flex-col gap-3 md:rounded-3xl md:bg-card md:p-5 md:text-card-foreground"
    >
      <div className="flex flex-col max-md:hidden">
        <h2 id={`order-next-${order.id}`} className="text-body-sm-strong">
          {t(stage ? "next.title" : "next.undoTitle")}
        </h2>
        <p className="text-label text-muted-foreground">
          {t(stage ? `next.${stage}` : "next.undoBody")}
        </p>
      </div>
      <PhoneFootBar>
        {stage ? (
          <OrderActions
            orderId={order.id}
            name={order.customerName}
            stage={stage}
            listPath={list}
            fill
          />
        ) : (
          <ReopenButton orderId={order.id} />
        )}
      </PhoneFootBar>
    </section>
  );
}
