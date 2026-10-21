import { BanIcon, CircleCheckIcon, CircleXIcon, TimerOffIcon, type LucideIcon } from "lucide-react";
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

// The order page's width: a phone's column, wider on a tablet, and from 1024px the content width of the wide
// layout, where the order's details sit in a column at the right (SEC-97 › decision 8).
const PAGE_WIDTH = "max-w-xl md:max-w-3xl lg:max-w-292";

/**
 * The blue band at the top of an order (Figma K6, K6b): the back button and the order's number, a line in lime, a
 * large figure under it and a line in pale blue, then the four steps.
 */
function StatusBand({
  order,
  eyebrow,
  figure,
  line,
  beside,
}: {
  order: Order;
  eyebrow: string;
  figure: string;
  line: string;
  /** Whether the ticket sits at the right of the band from 1024px (Figma D4), so the band leaves room for it. */
  beside?: boolean;
}) {
  const t = useTranslations("Orders");

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-header text-header-foreground",
        beside && "lg:col-span-3 lg:row-start-1 lg:rounded-4xl",
      )}
    >
      <span aria-hidden className="absolute -top-24 -right-20 size-64 rounded-full bg-sweep" />
      <div
        className={cn(
          "relative mx-auto flex w-full flex-col px-4 pb-10",
          PAGE_WIDTH,
          beside && "lg:max-w-none lg:py-4 lg:pr-100 lg:pl-10",
        )}
      >
        <div className="flex h-16 items-center gap-3">
          <BackButton fallback="/orders" />
          <h1 className="text-bar-title">{t("orderNumber", { number: order.number })}</h1>
        </div>
        <p className="mt-3 text-title text-fresh">{eyebrow}</p>
        <p className="font-display text-display">{figure}</p>
        <p className="mt-1 text-body-sm text-inverse-muted">{line}</p>
        <div className="mt-5">
          <OrderSteps order={order} />
        </div>
      </div>
    </section>
  );
}

/** The pale ground under the band: one column, or from 1024px the main column beside the order's details. */
function OrderBody({ main, aside }: { main: React.ReactNode; aside: React.ReactNode }) {
  return (
    <div className="relative -mt-6 rounded-t-3xl bg-background">
      {/* grid-cols-1: a phone's one column may shrink, so a long seller's line that truncates does not widen
          the page past the screen (SEC-99). */}
      <div
        className={cn(
          "mx-auto grid w-full grid-cols-1 items-start gap-3 px-4 pt-4 pb-6 lg:grid-cols-3 lg:gap-6",
          PAGE_WIDTH,
        )}
      >
        <div className="flex flex-col gap-3 lg:col-span-2">{main}</div>
        <div className="flex flex-col gap-3">{aside}</div>
      </div>
    </div>
  );
}

/**
 * An order still to collect (Figma K6, D4): the blue band with the window in large figures, how long until it opens
 * or closes and the steps; on the pale ground below, the ticket with the orders placed with it, how to collect
 * once it is ready, the way to the counter and cancelling while it is free; the dishes and totals beside them.
 * From 1024px the article is a grid of three columns: the ticket at the right of the band, how to collect and
 * cancelling under it in two, the dishes and totals and the way to the counter in the third.
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
  const from = format.dateTime(new Date(order.windowStart), "time");
  const until = format.dateTime(new Date(order.windowEnd), "time");
  const ready = order.status === "ready";

  return (
    <article
      aria-label={t("orderNumber", { number: order.number })}
      className="lg:mx-auto lg:grid lg:max-w-292 lg:grid-cols-3 lg:items-start lg:gap-x-6 lg:gap-y-4 lg:pt-6"
    >
      <StatusBand
        beside
        order={order}
        eyebrow={t(`headline.${ready ? "ready" : "confirmed"}`)}
        figure={`${from} – ${until}`}
        line={
          windowPhase(order, now) === "before"
            ? t("opensIn", { left: duration(Date.parse(order.windowStart) - now) })
            : t("closesIn", { left: duration(Date.parse(order.windowEnd) - now) })
        }
      />
      <div className="relative -mt-6 rounded-t-3xl bg-background lg:contents">
        {/* grid-cols-1: see OrderBody. */}
        <div
          className={cn(
            "mx-auto grid w-full grid-cols-1 items-start gap-3 px-4 pt-4 pb-6 lg:contents",
            PAGE_WIDTH,
          )}
        >
          <div className="flex flex-col gap-3 lg:contents">
            <div className="lg:z-10 lg:col-start-3 lg:row-start-1 lg:m-8 lg:w-full lg:max-w-89.5 lg:self-center lg:justify-self-end">
              <CollectTicket order={order} together={together} />
            </div>
            {ready ? (
              <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2">
                <HowToCollect order={order} />
              </div>
            ) : null}
            <div className="lg:col-start-3 lg:row-start-3">
              <Directions order={order} />
            </div>
            {cancellable ? (
              <div className="flex justify-center lg:col-span-2 lg:col-start-1 lg:row-start-3 lg:justify-start">
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
          <div className="flex flex-col gap-3 lg:contents">
            <section
              aria-label={t("details")}
              className="rounded-2xl bg-card p-4 text-card-foreground lg:col-start-3 lg:row-start-2"
            >
              <OrderSummary order={order} />
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * A collected order (Figma K6b, WK6b): the blue band with when it was collected, what it saved in large figures
 * and the steps all done; below, the rating, or the rating given, beside the seller and the order's details.
 */
export function CollectedOrder({ order, together }: { order: Order; together: Order[] }) {
  const t = useTranslations("Orders");
  const format = useFormatter();
  const date = useOrderDate();
  const when = order.collectedAt ?? order.windowEnd;

  return (
    <article aria-label={t("orderNumber", { number: order.number })}>
      <StatusBand
        order={order}
        eyebrow={t("endedAt.collected", {
          time: format.dateTime(new Date(when), "time"),
          date: date(when),
        })}
        figure={formatPrice(savingOf(order))}
        line={t("savedLine", { units: unitsOf(order) })}
      />
      <OrderBody
        main={order.review ? <ReviewGiven review={order.review} /> : <ReviewForm order={order} />}
        aside={
          <section
            aria-label={t("details")}
            className="flex flex-col gap-3.5 rounded-2xl bg-card p-4 text-card-foreground"
          >
            <SellerRow order={order} />
            <TogetherLinks together={together} />
            <div className="border-t border-border pt-3.5">
              <OrderSummary order={order} />
            </div>
          </section>
        }
      />
    </article>
  );
}

type Ended = Exclude<Order["status"], "confirmed" | "ready" | "collected">;

// Each ended status with the colour of its receipt and its icon, so it is never told by colour alone (Figma D5:
// cancelled, refused and expired in the same receipt).
const ended: Record<Ended, { icon: LucideIcon; frame: string }> = {
  cancelled: { icon: CircleXIcon, frame: "bg-destructive text-destructive-foreground" },
  refused: { icon: BanIcon, frame: "bg-destructive text-destructive-foreground" },
  expired: { icon: TimerOffIcon, frame: "bg-warning-border text-warning-foreground" },
};

/** When an ended order ended, as the moment its status records, or the end of its window. */
function endedAt(order: Order & { status: Ended }): string {
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
      <p className="text-body-sm">{t(`summary.${order.status}`)}</p>
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
 * An order that has ended without being collected (Figma D5: cancelled, refused and expired): a receipt framed in
 * the colour of its status, with when it ended above the seller, the dishes and totals; then what happened, and
 * the way back to tonight's dishes.
 */
export function EndedOrder({ order }: { order: Order & { status: Ended } }) {
  const t = useTranslations("Orders");
  const format = useFormatter();
  const date = useOrderDate();
  const look = ended[order.status];
  const Icon = look.icon;
  const when = endedAt(order);
  const title = t("orderNumber", { number: order.number });

  return (
    <article aria-label={title}>
      <PageBar title={title} back="/orders" />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3.5 px-4 pt-4 pb-6">
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

/** Whether the order has ended without being collected, so it is shown as a receipt. */
export function hasEnded(order: Order): order is Order & { status: Ended } {
  return order.status !== "confirmed" && order.status !== "ready" && order.status !== "collected";
}
