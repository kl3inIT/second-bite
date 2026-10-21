"use client";

import { useFormatter, useNow, useTranslations } from "next-intl";

import type { OrderBody } from "@/lib/api/generated";

/**
 * The last figure of an order's strip (Figma AD-DH3, AD-DH5): how long the store still holds it, counted on
 * the reader's clock and refreshed every half minute; once the window is over, when it ended; for an order
 * that ended otherwise, when it did. The server's figure and the browser's may differ by a minute, so the
 * text is allowed to change as it hydrates.
 */
export function TimeLeft({ order }: { order: OrderBody }) {
  const t = useTranslations("Admin.orders.detail.left");
  const format = useFormatter();
  const now = useNow({ updateInterval: 30_000 });
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const end = time(order.windowEnd);

  let figure: string;
  let note: string;
  if (order.status === "collected" && order.collectedAt) {
    figure = t("collected");
    note = t("collectedAt", { time: time(order.collectedAt) });
  } else if (order.status === "cancelled" && order.cancelledAt) {
    figure = t("cancelled");
    note = t("endedAt", { time: time(order.cancelledAt) });
  } else if (order.status === "refused" && order.refusedAt) {
    figure = t("refused");
    note = t("endedAt", { time: time(order.refusedAt) });
  } else {
    const minutes = Math.ceil((new Date(order.windowEnd).getTime() - now.getTime()) / 60_000);
    if (order.status === "expired" || minutes <= 0) {
      figure = t("over");
      note = t("expiredAt", { time: end });
    } else {
      figure =
        minutes < 60
          ? t("minutes", { minutes })
          : t("hours", { hours: Math.floor(minutes / 60), minutes: minutes % 60 });
      note = t("heldUntil", { time: end });
    }
  }

  return (
    <>
      <dd suppressHydrationWarning className="font-display text-title text-foreground">
        {figure}
      </dd>
      <dd className="text-body-sm text-muted-foreground">{note}</dd>
    </>
  );
}
