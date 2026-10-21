import { BanIcon, CircleCheckIcon, CircleXIcon, TimerOffIcon, type LucideIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { BackButton } from "@/components/back-button";
import { PageBar } from "@/components/page-bar";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { CancelOrder } from "./cancel-order";
import { hoursAndMinutes, unitsOf, windowPhase, type Order } from "./order";
import {
  CollectTicket,
  Directions,
  HowToCollect,
  OrderSteps,
  OrderSummary,
  SellerRow,
  useOrderDate,
} from "./order-parts";

/** "1 giờ 12 phút", or "48 phút". */
function useDuration() {
  const t = useTranslations("Orders");
  return (milliseconds: number) => {
    const { hours, minutes } = hoursAndMinutes(milliseconds);
    return hours > 0 ? t("hoursMinutes", { hours, minutes }) : t("minutes", { minutes });
  };
}

/**
 * An order's title: the page's own, under a back button, or one seller's part under the title of orders placed
 * together (SEC-76 › decision 8), which has the back button.
 */
type Level = { level?: "page" | "part" };

/**
 * An order still to collect (Figma D2 preparing, D3 ready): the blue band with the window in large figures, how
 * long until it opens or closes and the steps; on the pale ground below, the ticket, how to collect once it
 * is ready, the dishes and totals, the way to the counter, and cancelling while it is free.
 */
export function OpenOrder({
  order,
  cancellable,
  now,
  level = "page",
}: {
  order: Order;
  cancellable: boolean;
  now: number;
} & Level) {
  const Title = level === "page" ? "h1" : "h2";
  const t = useTranslations("Orders");
  const format = useFormatter();
  const duration = useDuration();
  const from = format.dateTime(new Date(order.windowStart), "time");
  const until = format.dateTime(new Date(order.windowEnd), "time");
  const ready = order.status === "ready";

  return (
    <article aria-labelledby={`order-title-${order.id}`}>
      <section className="relative overflow-hidden bg-header text-header-foreground">
        <span aria-hidden className="absolute -top-24 -right-20 size-64 rounded-full bg-sweep" />
        <div className="relative mx-auto flex w-full max-w-xl flex-col px-4 pb-10">
          <div className="flex h-16 items-center gap-3">
            {level === "page" ? <BackButton fallback="/orders" /> : null}
            <Title id={`order-title-${order.id}`} className="text-bar-title">
              {t("orderNumber", { number: order.number })}
            </Title>
          </div>
          <p className="mt-3 text-title text-fresh">
            {t(`headline.${ready ? "ready" : "confirmed"}`)}
          </p>
          <p className="font-display text-display">
            {from} – {until}
          </p>
          <p className="mt-1 text-body-sm text-inverse-muted">
            {windowPhase(order, now) === "before"
              ? t("opensIn", { left: duration(Date.parse(order.windowStart) - now) })
              : t("closesIn", { left: duration(Date.parse(order.windowEnd) - now) })}
          </p>
          <div className="mt-5">
            <OrderSteps order={order} />
          </div>
        </div>
      </section>
      <div className="relative -mt-6 rounded-t-3xl bg-background">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-3 px-4 pt-4 pb-6">
          <CollectTicket order={order} />
          {ready ? <HowToCollect order={order} /> : null}
          <section
            aria-label={t("details")}
            className="rounded-2xl bg-card p-4 text-card-foreground"
          >
            <OrderSummary order={order} />
          </section>
          <Directions order={order} />
          {cancellable ? (
            <div className="flex justify-center">
              <CancelOrder
                orderId={order.id}
                access={order.access}
                number={order.number}
                seller={order.seller.name}
                units={unitsOf(order)}
                freeUntil={from}
              />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

type Ended = Exclude<Order["status"], "confirmed" | "ready">;

// Each ended status with the colour of its receipt and its icon, so it is never told by colour alone (Figma D5
// collected; cancelled, refused and expired in the same receipt).
const ended: Record<Ended, { icon: LucideIcon; frame: string }> = {
  collected: { icon: CircleCheckIcon, frame: "bg-primary text-primary-foreground" },
  cancelled: { icon: CircleXIcon, frame: "bg-destructive text-destructive-foreground" },
  refused: { icon: BanIcon, frame: "bg-destructive text-destructive-foreground" },
  expired: { icon: TimerOffIcon, frame: "bg-warning-border text-warning-foreground" },
};

/** When an ended order ended, as the moment its status records, or the end of its window. */
function endedAt(order: Order & { status: Ended }): string {
  if (order.status === "collected") return order.collectedAt ?? order.windowEnd;
  if (order.status === "cancelled") return order.cancelledAt ?? order.windowEnd;
  if (order.status === "refused") return order.refusedAt ?? order.windowEnd;
  return order.windowEnd;
}

/** What happened to an order, as a list of moments (Figma D5 › Trạng thái). */
function Timeline({ order }: { order: Order & { status: Ended } }) {
  const t = useTranslations("Orders.timeline");
  const format = useFormatter();
  const date = useOrderDate();
  const at = (value: string) => format.dateTime(new Date(value), "time");
  const units = unitsOf(order);
  const total = formatPrice(order.totalVnd);
  const moments: { title: string; body: string }[] = [
    {
      title: t("placed"),
      body: t("placedBody", {
        date: date(order.createdAt),
        time: at(order.createdAt),
        units,
        total,
      }),
    },
    // An order is confirmed when it is placed; staff never accept one (docs/specs/order.md).
    { title: t("confirmed"), body: t("confirmedBody", { time: at(order.createdAt), units }) },
  ];
  if (order.readyAt) {
    moments.push({ title: t("ready"), body: t("readyBody", { time: at(order.readyAt) }) });
  }
  if (order.status === "collected" && order.collectedAt) {
    moments.push({
      title: t("collected"),
      body: t("collectedBody", { time: at(order.collectedAt), total }),
    });
  }
  if (order.status === "cancelled" && order.cancelledAt) {
    moments.push({
      title: t("cancelled"),
      body: order.cancelReason
        ? t("withReason", { time: at(order.cancelledAt), reason: order.cancelReason })
        : at(order.cancelledAt),
    });
    moments.push({ title: t("returned", { units }), body: t("returnedBody") });
  }
  if (order.status === "refused" && order.refusedAt) {
    moments.push({
      title: t("refused"),
      body: order.refuseReason
        ? t("withReason", { time: at(order.refusedAt), reason: t(`reason.${order.refuseReason}`) })
        : at(order.refusedAt),
    });
  }
  if (order.status === "expired") {
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
      {order.status === "collected" ? null : (
        <p className="text-body-sm">{t(`summary.${order.status}`)}</p>
      )}
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
 * An order that has ended (Figma D5 collected; cancelled, refused and expired the same way): a receipt framed in
 * the colour of its status, with when it ended above the seller, the dishes and totals; then what happened, and
 * the way back to tonight's dishes.
 */
export function EndedOrder({
  order,
  level = "page",
}: { order: Order & { status: Ended } } & Level) {
  const t = useTranslations("Orders");
  const format = useFormatter();
  const date = useOrderDate();
  const look = ended[order.status];
  const Icon = look.icon;
  const when = endedAt(order);
  const title = t("orderNumber", { number: order.number });

  return (
    <article aria-label={title}>
      {level === "page" ? <PageBar title={title} back="/orders" /> : null}
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3.5 px-4 pt-4 pb-6">
        {level === "part" ? <h2 className="text-bar-title">{title}</h2> : null}
        <section
          aria-label={t("details")}
          className={cn("rounded-2xl px-0.75 pb-0.75", look.frame)}
        >
          <p className="flex items-center justify-center gap-1.5 py-2 text-body-sm-strong">
            <Icon aria-hidden className="size-4" />
            {t(`endedAt.${order.status}`, {
              time: format.dateTime(new Date(when), "time"),
              date: date(when),
            })}
          </p>
          <div className="flex flex-col gap-3.5 rounded-xl bg-card p-4 text-card-foreground">
            <SellerRow order={order} />
            <div className="border-t border-border pt-3.5">
              <OrderSummary order={order} />
            </div>
          </div>
        </section>
        <Timeline order={order} />
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          {t("seeOthers")}
        </Link>
      </div>
    </article>
  );
}

/** Whether the order has ended, so it is shown as one that has. */
export function hasEnded(order: Order): order is Order & { status: Ended } {
  return order.status !== "confirmed" && order.status !== "ready";
}
