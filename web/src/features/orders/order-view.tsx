import { CircleCheckIcon, CircleXIcon, ClockFadingIcon, type LucideIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { BackButton } from "@/components/back-button";
import { PageBar } from "@/components/page-bar";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { CancelOrder } from "./cancel-order";
import { hoursAndMinutes, savingOf, unitsOf, windowPhase, type Order } from "./order";
import {
  CollectTicket,
  Directions,
  HowToCollect,
  OrderFacts,
  OrderSteps,
  OrderSummary,
  SellerRow,
  TogetherLinks,
  useOrderDate,
} from "./order-parts";
import { ReviewForm } from "./review-form";
import { ReviewGiven } from "./review-given";

/** "1 giờ 12 phút", or "48 phút". */
function useDuration() {
  const t = useTranslations("Orders");
  return (milliseconds: number) => {
    const { hours, minutes } = hoursAndMinutes(milliseconds);
    return hours > 0 ? t("hoursMinutes", { hours, minutes }) : t("minutes", { minutes });
  };
}

// A phone's column, and the frame of the wide layout from 768px (Figma D4): the content width, 32px from the sides,
// the blocks 24px apart. The pale ground rises over the customer header's foot, so the frame starts 32px under it.
const PHONE_COLUMN = "max-w-xl";
const WIDE_FRAME = "md:mx-auto md:flex md:w-full md:max-w-292 md:flex-col md:gap-6 md:px-8 md:pt-8";

/** "Đơn #SB-24817 · đặt hôm nay 19:52 · La Paris, Tầng 1", the line over the status on a wide screen (Figma D4). */
function useOrderMeta(order: Order, now: number) {
  const t = useTranslations("Orders");
  const format = useFormatter();
  const date = useOrderDate();
  const placed = date(order.createdAt);
  const values = {
    number: order.number,
    date: placed,
    time: format.dateTime(new Date(order.createdAt), "time"),
    seller: order.seller.name,
    address: order.seller.address,
  };
  return t(placed === date(new Date(now).toISOString()) ? "metaToday" : "metaOn", values);
}

/**
 * The blue band at the top of an order (Figma K6, K6b, D4): on a phone the back button and the order's number, a
 * line in lime, a large figure under it and a line in pale blue, then the four steps; from 768px a rounded card
 * on the page's ground that starts with the order's number, placing and seller, with the ticket at its right
 * from 1024px.
 */
function StatusBand({
  order,
  meta,
  eyebrow,
  figure,
  line,
  ticket,
}: {
  order: Order;
  meta: string;
  eyebrow: string;
  figure: string;
  line: string;
  /** The ticket of an open order: under the band on a phone, in it from 768px (Figma D4). */
  ticket?: React.ReactNode;
}) {
  const t = useTranslations("Orders");

  return (
    <section className="md:flex md:flex-col md:gap-10 md:rounded-28 md:bg-header md:py-8 md:pr-8 md:pl-10 md:text-header-foreground lg:flex-row lg:items-center">
      <div className="relative overflow-hidden bg-header text-header-foreground md:flex-1 md:overflow-visible md:bg-transparent">
        <span
          aria-hidden
          className="absolute -top-24 -right-20 size-64 rounded-full bg-sweep md:hidden"
        />
        <div
          className={cn(
            "relative mx-auto flex w-full flex-col px-4 pb-10 md:max-w-none md:gap-2 md:p-0",
            PHONE_COLUMN,
          )}
        >
          <div className="flex h-16 items-center gap-3 md:hidden">
            <BackButton fallback="/orders" />
            <h1 className="text-bar-title">{t("orderNumber", { number: order.number })}</h1>
          </div>
          <h1 className="hidden text-body-sm font-medium text-inverse-muted md:block">{meta}</h1>
          <p className="mt-3 text-title text-fresh md:mt-0 md:text-card-title">{eyebrow}</p>
          <p className="font-display text-display md:text-display-60">{figure}</p>
          <p className="mt-1 text-body-sm text-inverse-muted md:mt-0 md:text-body">{line}</p>
          <div className="mt-5 md:mt-0 md:pt-4">
            <OrderSteps order={order} />
          </div>
        </div>
      </div>
      {ticket ? (
        <div className="relative -mt-6 rounded-t-3xl bg-background md:m-0 md:w-full md:max-w-89.5 md:rounded-none md:bg-transparent lg:shrink-0">
          <div className={cn("mx-auto w-full px-4 pt-4 md:max-w-none md:p-0", PHONE_COLUMN)}>
            {ticket}
          </div>
        </div>
      ) : null}
    </section>
  );
}

/** The pale ground under a collected order's band: one column, or from 1024px the main column beside the order's details. */
function OrderBody({ main, aside }: { main: React.ReactNode; aside: React.ReactNode }) {
  return (
    <div className="relative -mt-6 rounded-t-3xl bg-background md:mt-0 md:rounded-none md:bg-transparent">
      {/* grid-cols-1: a phone's one column may shrink, so a long seller's line that truncates does not widen
          the page past the screen (SEC-99). */}
      <div
        className={cn(
          "mx-auto grid w-full grid-cols-1 items-start gap-3 px-4 pt-4 pb-6 md:max-w-none md:gap-4 md:p-0 lg:flex lg:gap-6",
          PHONE_COLUMN,
        )}
      >
        <div className="flex flex-col gap-3 lg:min-w-0 lg:flex-1">{main}</div>
        <div className="flex flex-col gap-3 lg:w-89.5 lg:shrink-0">{aside}</div>
      </div>
    </div>
  );
}

/**
 * An order still to collect (Figma D2, D3, D4): the blue band with the window in large figures, how long until it
 * opens or closes and the steps; on a phone the ticket under it, how to collect once it is ready, the dishes and
 * totals, the way to the counter, and cancelling at the very end. From 768px the ticket is in the band, and two
 * columns follow: how to collect and cancelling, then the order's details and the way to the counter (one column
 * below 1024px).
 */
export function OpenOrder({
  order,
  cancellable,
  together,
  now,
}: {
  order: Order;
  cancellable: boolean;
  together: Order[];
  now: number;
}) {
  const t = useTranslations("Orders");
  const format = useFormatter();
  const duration = useDuration();
  const meta = useOrderMeta(order, now);
  const from = format.dateTime(new Date(order.windowStart), "time");
  const until = format.dateTime(new Date(order.windowEnd), "time");
  const ready = order.status === "ready";

  return (
    <article aria-label={t("orderNumber", { number: order.number })} className={WIDE_FRAME}>
      <StatusBand
        order={order}
        meta={meta}
        eyebrow={t(`headline.${ready ? "ready" : "confirmed"}`)}
        figure={`${from} – ${until}`}
        line={
          windowPhase(order, now) === "before"
            ? t("opensIn", { left: duration(Date.parse(order.windowStart) - now) })
            : t("closesIn", { left: duration(Date.parse(order.windowEnd) - now) })
        }
        ticket={<CollectTicket order={order} together={together} />}
      />
      {/* On a phone the two columns are one: their cards follow each other, cancelling last. */}
      <div
        className={cn(
          "mx-auto flex w-full flex-col gap-3 px-4 pt-3 pb-6 md:max-w-none md:gap-4 md:p-0 lg:flex-row lg:items-start lg:gap-6",
          PHONE_COLUMN,
        )}
      >
        <div className="max-lg:contents lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:gap-4">
          {/* Figma D2 has no steps to collect before the order is ready; D4 has them in both. */}
          <div className={cn(!ready && "max-md:hidden")}>
            <HowToCollect order={order} />
          </div>
          {cancellable ? (
            <div className="max-lg:order-last">
              <CancelOrder
                orderId={order.id}
                access={order.access}
                number={order.number}
                seller={order.seller.name}
                units={unitsOf(order)}
              />
            </div>
          ) : null}
        </div>
        <div className="max-lg:contents lg:flex lg:w-89.5 lg:shrink-0 lg:flex-col lg:gap-4">
          <section
            aria-label={t("details")}
            className="rounded-2xl bg-card p-4 text-card-foreground"
          >
            <div className="md:hidden">
              <OrderSummary order={order} />
            </div>
            <div className="hidden md:block">
              <OrderFacts order={order} />
            </div>
          </section>
          <Directions order={order} />
        </div>
      </div>
    </article>
  );
}

/**
 * A collected order (Figma K6b, WK6b): the blue band with when it was collected, what it saved in large figures
 * and the steps all done; below, the rating, or the rating given, beside the seller and the order's details.
 */
export function CollectedOrder({
  order,
  together,
  now,
}: {
  order: Order;
  together: Order[];
  now: number;
}) {
  const t = useTranslations("Orders");
  const format = useFormatter();
  const date = useOrderDate();
  const when = order.collectedAt ?? order.windowEnd;
  const meta = useOrderMeta(order, now);
  // A phone shows a rated order as a receipt with what happened (Figma D5); the wide layout keeps the band.
  const rated = order.review !== undefined;

  return (
    <article aria-label={t("orderNumber", { number: order.number })} className={WIDE_FRAME}>
      <div className={cn(rated && "max-md:hidden")}>
        <StatusBand
          order={order}
          meta={meta}
          eyebrow={t("collectedAt", { time: format.dateTime(new Date(when), "time") })}
          figure={formatPrice(savingOf(order))}
          line={t("savedLine", { units: unitsOf(order) })}
        />
      </div>
      <div className={cn(rated && "max-md:hidden")}>
        <OrderBody
          main={order.review ? <ReviewGiven review={order.review} /> : <ReviewForm order={order} />}
          aside={
            <section
              aria-label={t("details")}
              className="flex flex-col gap-3.5 rounded-2xl bg-card p-4 text-card-foreground"
            >
              <div className="flex flex-col gap-3.5 md:hidden">
                <SellerRow order={order} />
                <TogetherLinks together={together} />
                <div className="border-t border-border pt-3.5">
                  <OrderSummary order={order} />
                </div>
              </div>
              <div className="hidden md:block">
                <OrderFacts order={order} />
              </div>
            </section>
          }
        />
      </div>
      {rated ? (
        <div className="md:hidden">
          <Receipt
            order={order}
            look={{ frame: "bg-primary text-primary-foreground" }}
            badge={t("endedAt.collected", {
              time: format.dateTime(new Date(when), "time"),
              date: date(when),
            })}
          />
        </div>
      ) : null}
    </article>
  );
}

type Ended = Exclude<Order["status"], "confirmed" | "ready" | "collected">;

// Each ended status with the colour of its receipt and its icon, so it is never told by colour alone (Figma D5:
// cancelled, refused and expired in the same receipt).
const ended: Record<Ended, { icon: LucideIcon; frame: string; band: string }> = {
  cancelled: {
    icon: CircleXIcon,
    frame: "bg-destructive text-destructive-foreground",
    band: "bg-destructive-muted text-destructive",
  },
  refused: {
    icon: CircleXIcon,
    frame: "bg-destructive text-destructive-foreground",
    band: "bg-destructive-muted text-destructive",
  },
  expired: {
    icon: ClockFadingIcon,
    frame: "bg-warning-border text-warning-foreground",
    band: "bg-warning text-warning-foreground",
  },
};

/** When an ended order ended, as the moment its status records, or the end of its window. */
function endedAt(order: Order & { status: Ended }): string {
  if (order.status === "cancelled") return order.cancelledAt ?? order.windowEnd;
  if (order.status === "refused") return order.refusedAt ?? order.windowEnd;
  return order.windowEnd;
}

/** What happened to an order, as a list of moments (Figma D5 › Trạng thái). */
function Timeline({ order }: { order: Order }) {
  const t = useTranslations("Orders.timeline");
  const format = useFormatter();
  const date = useOrderDate();
  const at = (value: string) => format.dateTime(new Date(value), "time");
  const units = unitsOf(order);
  // A cancelled order shows its whole course; a refused or expired one only what ended it (Figma D5, O5, O6).
  const moments: { title: string; body: string }[] = [];
  if (order.status === "cancelled") {
    moments.push(
      {
        title: t("placed"),
        body: t("placedBody", {
          date: date(order.createdAt),
          time: at(order.createdAt),
          units,
          total: formatPrice(order.totalVnd),
        }),
      },
      // An order is confirmed when it is placed; staff never accept one (docs/specs/order.md).
      { title: t("confirmed"), body: t("confirmedBody", { time: at(order.createdAt), units }) },
    );
    if (order.cancelledAt) {
      moments.push({
        title: t("cancelled"),
        body: order.cancelReason
          ? t("withReason", { time: at(order.cancelledAt), reason: order.cancelReason })
          : at(order.cancelledAt),
      });
      moments.push({ title: t("returned", { units }), body: t("returnedBody") });
    }
  }
  if (order.status === "collected") {
    const collectedAt = order.collectedAt ?? order.windowEnd;
    const paid = { time: at(collectedAt), total: formatPrice(order.totalVnd) };
    moments.push(
      {
        title: t("placed"),
        body: t("placedBody", {
          date: date(order.createdAt),
          time: at(order.createdAt),
          units,
          total: formatPrice(order.totalVnd),
        }),
      },
      { title: t("confirmed"), body: t("confirmedBody", { time: at(order.createdAt), units }) },
    );
    if (order.readyAt) {
      moments.push({ title: t("ready"), body: t("readyBody", { time: at(order.readyAt) }) });
    }
    moments.push({
      title: t("collected"),
      body: order.review
        ? t("collectedRated", { ...paid, stars: order.review.stars })
        : t("collectedBody", paid),
    });
  }
  if (order.status === "refused" && order.refusedAt) {
    moments.push({
      title: t("refused"),
      body: order.refuseReason
        ? t("refusedBody", { time: at(order.refusedAt), reason: t(`reason.${order.refuseReason}`) })
        : at(order.refusedAt),
    });
  }
  if (order.status === "expired") {
    if (order.readyAt) {
      moments.push({
        title: t("ready"),
        body: t("toldBody", { date: date(order.readyAt), time: at(order.readyAt) }),
      });
    }
    moments.push({ title: t("expired"), body: t("expiredBody", { until: at(order.windowEnd) }) });
  }

  return (
    <section
      aria-labelledby={`order-timeline-${order.id}`}
      className="flex flex-col gap-3.5 rounded-2xl bg-card px-4 pt-4 pb-4.5 text-card-foreground"
    >
      <h2
        id={`order-timeline-${order.id}`}
        className="text-label-strong text-muted-foreground uppercase"
      >
        {t("title")}
      </h2>
      {hasEnded(order) ? (
        <p className="text-body-sm">
          {t(`summary.${order.status}`, {
            until: at(order.windowEnd),
            reason: t(`reason.${order.refuseReason ?? "other"}`),
          })}
        </p>
      ) : null}
      <ol className="flex flex-col gap-3.5">
        {moments.map(({ title, body }) => (
          <li key={title} className="flex items-center gap-3">
            <CircleCheckIcon
              aria-hidden
              className="size-6 shrink-0 fill-success text-success-foreground"
            />
            <div className="flex flex-col">
              <p className="text-body-sm-strong">{title}</p>
              <p className="text-label text-muted-foreground">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * An order's receipt framed in the colour of what became of it, with what happened beside it from 1024px, and the
 * way back to tonight's dishes (Figma D5, O5, O6).
 */
function Receipt({
  order,
  look,
  badge,
}: {
  order: Order;
  look: { icon?: LucideIcon; frame: string };
  badge: string;
}) {
  const t = useTranslations("Orders");
  const Icon = look.icon;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3.5 px-4 pt-4 pb-6 md:max-w-none md:gap-6 md:p-0 lg:grid lg:grid-cols-2 lg:items-start">
      <section aria-label={t("details")} className={cn("rounded-2xl px-0.75 pb-0.75", look.frame)}>
        <p className="flex items-center justify-center gap-1.5 py-2 text-body-sm-strong">
          {Icon ? <Icon aria-hidden className="size-4" /> : null}
          {badge}
        </p>
        <div className="rounded-xl bg-card p-4 text-card-foreground">
          <div className="flex flex-col gap-3.5 md:hidden">
            <SellerRow order={order} />
            <div className="border-t border-border pt-3.5">
              <OrderSummary order={order} />
            </div>
          </div>
          <div className="hidden md:block">
            <OrderFacts order={order} />
          </div>
        </div>
      </section>
      <Timeline order={order} />
      <Link href="/" className={cn(buttonVariants({ size: "lg" }), "md:hidden")}>
        {t("seeOthers")}
      </Link>
    </div>
  );
}

/** The phone's blue bar, or from 768px the customer header, over an ended order. */
export function EndedOrderBar({ order }: { order: Order }) {
  const t = useTranslations("Orders");
  return (
    <PageBar
      title={t("orderNumber", { number: order.number })}
      back="/orders"
      returnTo={`/orders/${order.id}`}
    />
  );
}

/**
 * An order that has ended without being collected (Figma D5: cancelled, refused and expired): a receipt framed in
 * the colour of its status, with when it ended above the seller, the dishes and totals; then what happened, and
 * the way back to tonight's dishes. From 768px a band in the status' colour leads (Figma D5 web): the order's
 * number and seller, what happened in large figures and the way back to tonight's dishes at its right; the
 * receipt and what happened sit side by side from 1024px.
 */
export function EndedOrder({ order, now }: { order: Order & { status: Ended }; now: number }) {
  const t = useTranslations("Orders");
  const format = useFormatter();
  const meta = useOrderMeta(order, now);
  const look = ended[order.status];
  const when = endedAt(order);
  const time = format.dateTime(new Date(when), "time");
  const line = {
    cancelled: t("ended.cancelledLine", { time, units: unitsOf(order) }),
    refused: t("ended.refusedLine", {
      time,
      reason: t(`timeline.reason.${order.refuseReason ?? "other"}`),
    }),
    expired: t("ended.expiredLine", { until: format.dateTime(new Date(order.windowEnd), "time") }),
  }[order.status];

  return (
    <article
      aria-label={t("orderNumber", { number: order.number })}
      className="md:mx-auto md:flex md:w-full md:max-w-292 md:flex-col md:gap-6 md:px-8 md:pt-8"
    >
      <section
        className={cn(
          "hidden md:flex md:items-center md:justify-between md:gap-10 md:rounded-28 md:p-8",
          look.band,
        )}
      >
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="text-body-sm font-medium text-muted-foreground">{meta}</h1>
          <p className="font-display text-display-48">{t(`ended.title.${order.status}`)}</p>
          <p className="text-body text-foreground">{line}</p>
        </div>
        <div className="flex w-90 shrink-0 flex-col rounded-3xl bg-card p-5">
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            {t("seeOthers")}
          </Link>
        </div>
      </section>
      <Receipt order={order} look={look} badge={t(`ended.badge.${order.status}`)} />
    </article>
  );
}

/** Whether the order has ended without being collected, so it is shown as a receipt. */
export function hasEnded(order: Order): order is Order & { status: Ended } {
  return order.status !== "confirmed" && order.status !== "ready" && order.status !== "collected";
}
