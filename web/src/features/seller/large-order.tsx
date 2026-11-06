import { PhoneIcon, TriangleAlertIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { OrderBody } from "@/lib/api/generated";

// What a store reads before it prepares an order that may have been placed to hold its food (SEC-158, Figma L2, L3):
// the order is large (a line reached its dish's cap or took more than half the units posted), or its phone number
// holds other orders at the store or missed some lately. The server confirms it like any other; the store decides,
// and refuses it as "Nghi đặt ảo" if it doubts it.

/** Whether an order is worth a look: large, or its phone number holds others here or missed some. */
export function worthALook(order: OrderBody): boolean {
  const phone = order.phone;
  return order.large || (phone !== undefined && (phone.open > 1 || phone.missed > 0));
}

/** The line under the customer on the store's list (Figma L2): the badge, then the phone number's orders. */
export async function LargeOrderLine({ order }: { order: OrderBody }) {
  if (!worthALook(order)) return null;
  const t = await getTranslations("StoreOrders.large");
  return (
    <p className="flex flex-wrap items-center gap-2 text-label text-warning-foreground">
      {order.large && (
        <Badge variant="warning">
          <TriangleAlertIcon aria-hidden />
          {t("badge")}
        </Badge>
      )}
      {order.phone && (
        <span>{t("history", { open: order.phone.open, missed: order.phone.missed })}</span>
      )}
    </p>
  );
}

/** The box above the order's actions on its page (Figma L3), with a call to the customer. */
export async function LargeOrderAlert({ order }: { order: OrderBody }) {
  if (!worthALook(order)) return null;
  const t = await getTranslations("StoreOrders.large");
  const largest = order.lines.toSorted((a, b) => b.units - a.units)[0];
  return (
    <Alert variant="warning">
      <TriangleAlertIcon aria-hidden />
      <AlertTitle>{t(order.large ? "badge" : "title")}</AlertTitle>
      <AlertDescription>
        <span className="flex flex-col gap-2">
          {order.large && largest && (
            <span>
              {t("units", { count: largest.units, unit: largest.unit, name: largest.name })}
            </span>
          )}
          {order.phone && (
            <span>{t("historyLong", { open: order.phone.open, missed: order.phone.missed })}</span>
          )}
          <span>{t("advice")}</span>
          {order.customerPhone && (
            <a
              href={`tel:${order.customerPhone}`}
              className={buttonVariants({ variant: "outline", className: "self-start" })}
            >
              <PhoneIcon aria-hidden />
              {t("call", { phone: order.customerPhone })}
            </a>
          )}
        </span>
      </AlertDescription>
    </Alert>
  );
}
