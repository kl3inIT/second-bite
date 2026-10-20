import { BanIcon, CircleCheckIcon, CircleXIcon, TimerOffIcon, type LucideIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { CancelOrder } from "./cancel-order";
import { hoursAndMinutes, unitsOf, windowPhase, type Order } from "./order";
import {
  CodeTicket,
  Directions,
  HowToCollect,
  OrderDetails,
  OrderFacts,
  OrderSteps,
  SellerRow,
} from "./order-parts";

/** The line above an order's title: its number, when it was placed and where it is collected. */
function OrderMeta({ order, className }: { order: Order; className?: string }) {
  const t = useTranslations("Orders");
  const format = useFormatter();

  return (
    <p className={cn("text-label", className)}>
      {t("meta", {
        number: order.number,
        time: format.dateTime(new Date(order.createdAt), "time"),
        seller: order.seller.name,
        address: order.seller.address,
      })}
    </p>
  );
}

/** "1 giờ 12 phút", or "48 phút". */
function useDuration() {
  const t = useTranslations("Orders");
  return (milliseconds: number) => {
    const { hours, minutes } = hoursAndMinutes(milliseconds);
    return hours > 0 ? t("hoursMinutes", { hours, minutes }) : t("minutes", { minutes });
  };
}

/**
 * An order still to collect (Figma W2 confirmed, W3 ready): the blue band with the window in large figures,
 * how long until it opens or closes and the steps, the code ticket beside it; then how to collect, a change
 * of mind while it is free, the facts and the way to the counter.
 */
export function OpenOrder({
  order,
  cancellable,
  now,
}: {
  order: Order;
  cancellable: boolean;
  now: number;
}) {
  const t = useTranslations("Orders");
  const format = useFormatter();
  const duration = useDuration();
  const from = format.dateTime(new Date(order.windowStart), "time");
  const until = format.dateTime(new Date(order.windowEnd), "time");
  const phase = windowPhase(order, now);

  return (
    <>
      <section aria-labelledby="order-status" className="bg-primary text-primary-foreground">
        <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 md:grid-cols-5 md:items-center xl:max-w-300">
          <div className="flex flex-col gap-2 md:col-span-3">
            <OrderMeta order={order} className="text-inverse-muted" />
            <h1 id="order-status" className="text-body-sm-strong text-fresh">
              {t(`headline.${order.status === "ready" ? "ready" : "confirmed"}`)}
            </h1>
            <p className="font-display text-display">
              {from} – {until}
            </p>
            <p className="text-body-sm text-inverse-muted">
              {phase === "before"
                ? t("opensIn", {
                    seller: order.seller.name,
                    left: duration(Date.parse(order.windowStart) - now),
                  })
                : t("closesIn", {
                    seller: order.seller.name,
                    left: duration(Date.parse(order.windowEnd) - now),
                  })}
            </p>
            <OrderSteps order={order} />
          </div>
          <div className="md:col-span-2">
            <CodeTicket order={order} />
          </div>
        </div>
      </section>
      <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-6 md:grid-cols-5 md:items-start xl:max-w-300">
        <div className="flex flex-col gap-4 md:col-span-3">
          <HowToCollect order={order} />
          {cancellable ? (
            <section
              aria-labelledby="change-of-mind"
              className="flex flex-wrap items-center gap-4 rounded-3xl bg-card p-5 text-card-foreground"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <CircleXIcon aria-hidden className="size-5" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <h2 id="change-of-mind" className="text-body-sm-strong">
                  {t("changeOfMind")}
                </h2>
                <p className="text-label text-muted-foreground">
                  {t("changeOfMindBody", { from })}
                </p>
              </div>
              <CancelOrder
                orderId={order.id}
                number={order.number}
                seller={order.seller.name}
                units={unitsOf(order)}
              />
            </section>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 md:col-span-2">
          <OrderDetails order={order} />
          <Directions order={order} />
        </div>
      </div>
    </>
  );
}

type Ended = Exclude<Order["status"], "confirmed" | "ready">;

// Each ended status with its band, its ribbon and its icon, so it is never told by colour alone
// (Figma W4 cancelled, W5 refused, W6 expired).
const ended: Record<Ended, { icon: LucideIcon; band: string; title: string; ribbon: string }> = {
  collected: {
    icon: CircleCheckIcon,
    band: "bg-success/10",
    title: "text-success",
    ribbon: "bg-success text-success-foreground",
  },
  cancelled: {
    icon: CircleXIcon,
    band: "bg-destructive/10",
    title: "text-destructive",
    ribbon: "bg-destructive text-destructive-foreground",
  },
  refused: {
    icon: BanIcon,
    band: "bg-destructive/10",
    title: "text-destructive",
    ribbon: "bg-destructive text-destructive-foreground",
  },
  expired: {
    icon: TimerOffIcon,
    band: "bg-warning",
    title: "text-warning-foreground",
    ribbon: "bg-warning-border text-warning-foreground",
  },
};

/** What happened to an ended order, as a list of moments (Figma W4–W6 › Trạng thái). */
function EndedTimeline({ order }: { order: Order & { status: Ended } }) {
  const t = useTranslations("Orders.timeline");
  const format = useFormatter();
  const at = (value: string) => format.dateTime(new Date(value), "time");
  const moments: { title: string; body: string }[] = [
    { title: t("placed"), body: at(order.createdAt) },
  ];
  if (order.readyAt) moments.push({ title: t("ready"), body: at(order.readyAt) });
  if (order.status === "collected" && order.collectedAt) {
    moments.push({ title: t("collected"), body: at(order.collectedAt) });
  }
  if (order.status === "cancelled" && order.cancelledAt) {
    moments.push({
      title: t("cancelled"),
      body: order.cancelReason
        ? t("withReason", { time: at(order.cancelledAt), reason: order.cancelReason })
        : at(order.cancelledAt),
    });
    moments.push({ title: t("returned", { units: unitsOf(order) }), body: t("returnedBody") });
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
      aria-labelledby="order-timeline"
      className="flex flex-col gap-3 rounded-3xl bg-card p-5 text-card-foreground"
    >
      <h2 id="order-timeline" className="text-label text-muted-foreground uppercase">
        {t("title")}
      </h2>
      <p className="text-body-sm">{t(`summary.${order.status}`)}</p>
      <ol className="flex flex-col gap-3">
        {moments.map(({ title, body }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
              <CircleCheckIcon aria-hidden className="size-4" />
            </span>
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
 * An order that has ended (Figma W4 cancelled, W5 refused, W6 expired, and collected): a tinted band with
 * its status large and what it meant, the ticket with its status on a ribbon, and what happened.
 */
export function EndedOrder({ order }: { order: Order & { status: Ended } }) {
  const t = useTranslations("Orders");
  const format = useFormatter();
  const look = ended[order.status];
  const Icon = look.icon;

  return (
    <>
      <section aria-labelledby="order-status" className={look.band}>
        <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 md:grid-cols-5 md:items-center xl:max-w-300">
          <div className="flex flex-col gap-2 md:col-span-3">
            <OrderMeta order={order} className="text-muted-foreground" />
            <h1 id="order-status" className={cn("text-display", look.title)}>
              {t(`ended.${order.status}`)}
            </h1>
            <p className="text-body-sm">
              {t(`endedBody.${order.status}`, {
                until: format.dateTime(new Date(order.windowEnd), "time"),
                units: unitsOf(order),
              })}
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl bg-card p-5 text-card-foreground md:col-span-2">
            <p className="text-center text-body-sm-strong text-primary">{t("tonightMore")}</p>
            <Link href="/" className={buttonVariants({ size: "lg" })}>
              {t("seeOthers")}
            </Link>
          </div>
        </div>
      </section>
      <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-6 md:grid-cols-5 md:items-start xl:max-w-300">
        <section
          aria-label={t("details")}
          className={cn(
            "overflow-hidden rounded-3xl text-card-foreground md:col-span-3",
            look.ribbon,
          )}
        >
          <p className="flex items-center justify-center gap-1.5 py-2 text-label-strong">
            <Icon aria-hidden className="size-4" />
            {t(`status.${order.status}`)}
          </p>
          <div className="mx-1 mb-1 flex flex-col gap-4 rounded-3xl bg-card p-5 text-card-foreground">
            <SellerRow order={order} />
            <OrderFacts order={order} />
          </div>
        </section>
        <div className="md:col-span-2">
          <EndedTimeline order={order} />
        </div>
      </div>
    </>
  );
}

/** Whether the order has ended, so it is shown as one that has. */
export function hasEnded(order: Order): order is Order & { status: Ended } {
  return order.status !== "confirmed" && order.status !== "ready";
}
