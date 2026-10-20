import {
  BanIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  PackageCheckIcon,
  TimerOffIcon,
  type LucideIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import type { Order, OrderStatus } from "./order";

// Each status with its icon and its tone, so it is never told by colour alone (web guideline › Components):
// Figma W2 confirmed, W3 ready, W4 cancelled, W5 refused, W6 expired.
const looks: Record<OrderStatus, { icon: LucideIcon; tone: string }> = {
  confirmed: { icon: ClockIcon, tone: "bg-secondary text-secondary-foreground" },
  ready: { icon: PackageCheckIcon, tone: "bg-fresh text-fresh-foreground" },
  collected: { icon: CircleCheckIcon, tone: "bg-success text-success-foreground" },
  cancelled: { icon: CircleXIcon, tone: "bg-muted text-foreground" },
  refused: { icon: BanIcon, tone: "bg-destructive text-destructive-foreground" },
  expired: { icon: TimerOffIcon, tone: "bg-warning text-warning-foreground" },
};

/** The status as a small labelled chip, for a list of orders. */
export function OrderStatusChip({ status }: { status: OrderStatus }) {
  const t = useTranslations("Orders.status");
  const { icon: Icon, tone } = looks[status];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-label-strong",
        tone,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {t(status)}
    </span>
  );
}

/** The head of the order page: what is happening to the order, and what the customer does next. */
export function OrderStatusBanner({ order }: { order: Order }) {
  const t = useTranslations("Orders");
  const format = useFormatter();
  const { icon: Icon, tone } = looks[order.status];
  const from = format.dateTime(new Date(order.windowStart), "time");
  const until = format.dateTime(new Date(order.windowEnd), "time");

  return (
    <section
      aria-labelledby="order-status"
      className="flex flex-col gap-3 rounded-2xl bg-card p-5 text-card-foreground"
    >
      <p className="text-label text-muted-foreground">
        {t("numberAt", { number: order.number, seller: order.seller.name })}
      </p>
      <div className="flex items-start gap-3">
        <span
          className={cn("flex size-11 shrink-0 items-center justify-center rounded-full", tone)}
        >
          <Icon aria-hidden className="size-6" />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h1 id="order-status" className="text-headline">
            {t(`status.${order.status}`)}
          </h1>
          <p className="text-body-sm text-muted-foreground">
            {t(`next.${order.status}`, { from, until, seller: order.seller.name })}
          </p>
        </div>
      </div>
      {order.status === "refused" && order.refuseReason ? (
        <p className="rounded-xl bg-muted p-3 text-body-sm">
          {t(`refuseReason.${order.refuseReason}`)}
          {order.refuseNote ? ` · ${order.refuseNote}` : null}
        </p>
      ) : null}
    </section>
  );
}
