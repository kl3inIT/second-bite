import { ChevronRightIcon } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { unitsOf } from "./order";
import { OrderStatusChip } from "./order-status";
import { readMyOrders } from "./read-orders";
import { SignInPrompt } from "./sign-in-prompt";

export type Which = "open" | "ended";

/** The list the page shows: those still to collect unless the address asks for the ended ones. */
export function readWhich(value: unknown): Which {
  return value === "ended" ? "ended" : "open";
}

/** "Đang chờ nhận" and "Đã xong" as two links, so each list has an address of its own (Figma W7). */
export async function OrdersTabs({ which: pending }: { which: Promise<Which> }) {
  const [t, which] = await Promise.all([getTranslations("Orders"), pending]);

  return (
    <nav aria-label={t("lists")} className="grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
      {(["open", "ended"] as const).map((tab) => (
        <Link
          key={tab}
          href={tab === "open" ? "/orders" : { pathname: "/orders", query: { state: "ended" } }}
          aria-current={tab === which ? "page" : undefined}
          className={cn(
            "flex min-h-11 items-center justify-center rounded-lg text-body-sm-strong focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
            tab === which ? "bg-card text-primary" : "text-secondary-foreground",
          )}
        >
          {t(tab === "open" ? "tabOpen" : "tabEnded")}
        </Link>
      ))}
    </nav>
  );
}

/** The orders of one list, newest first, each leading to its page. */
export async function OrdersList({ which: pending }: { which: Promise<Which> }) {
  const which = await pending;
  const [t, format, read] = await Promise.all([
    getTranslations("Orders"),
    getFormatter(),
    readMyOrders(which),
  ]);
  if (!read.signedIn) {
    return (
      <div className="mt-4">
        <SignInPrompt returnTo="/orders" />
      </div>
    );
  }
  if (read.value.length === 0) {
    return (
      <p className="mt-4 rounded-2xl bg-card p-6 text-center text-body-sm text-muted-foreground">
        {t(which === "open" ? "noneOpen" : "noneEnded")}
      </p>
    );
  }

  return (
    <ul className="mt-4 flex flex-col gap-3">
      {read.value.map((order) => (
        <li key={order.id}>
          <Link
            href={`/orders/${order.id}`}
            className="flex items-center gap-3 rounded-2xl bg-card p-4 text-card-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <OrderStatusChip status={order.status} />
              <p className="truncate text-body-sm-strong">
                {order.lines.map((line) => line.name).join(", ")}
              </p>
              <p className="text-label text-muted-foreground">
                {t("listLine", {
                  seller: order.seller.name,
                  number: order.number,
                  units: unitsOf(order),
                  total: formatPrice(order.totalVnd),
                  from: format.dateTime(new Date(order.windowStart), "time"),
                  until: format.dateTime(new Date(order.windowEnd), "time"),
                })}
              </p>
            </div>
            <ChevronRightIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
