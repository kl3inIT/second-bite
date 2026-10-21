import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { UnreadPill } from "@/components/unread-pill";
import { formatPrice } from "@/features/offers/format";
import type { OrderBody } from "@/lib/api/generated";

import { Link } from "@/i18n/navigation";

import { CopyPhoneButton } from "./copy-phone-button";
import { OrderActions, ReopenButton } from "./order-actions";
import { endedBecause, type OrderTab, unitsOf } from "./store-orders";

// One order of a store (Figma Q5, Q5e, Q5f): the dish and who holds it with their phone to copy, the units in
// the dish's own unit, the amount to collect at the counter, and what the seller can do with it. The row leads to
// the order's own page (Figma Q5j, Q5k); its buttons and the phone's copy stay above that link. In the cancelled
// tab a line says why it ended. A customer's own cancelling, and a window that ran out, are not taken back.
export async function OrderRow({ order, tab }: { order: OrderBody; tab: OrderTab }) {
  const t = await getTranslations("StoreOrders");
  const [first] = order.lines;
  const names = order.lines.map((line) => line.name).join(", ");
  const units =
    order.lines.length === 1
      ? t("units", { count: first.units, unit: first.unit })
      : t("units", { count: unitsOf(order), unit: t("portions") });

  const why = endedBecause(order);
  let ended: string | undefined;
  if (why === "customer" || why === "expired") ended = t(`ended.${why}`);
  else if (why) {
    ended = order.refuseNote
      ? t("ended.note", { reason: t(`reason.${why}`), note: order.refuseNote })
      : t("ended.reason", { reason: t(`reason.${why}`) });
  }

  return (
    <li className="relative flex flex-wrap items-center gap-x-3 gap-y-3 border-b border-border py-4 last:border-b-0 last:pb-0 md:gap-x-4">
      <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted md:size-18">
        <Image
          src={`/api${first.photo.smallPath}`}
          alt=""
          fill
          sizes="72px"
          unoptimized
          className="object-cover"
        />
      </span>
      <div className="flex min-w-48 flex-1 flex-col">
        <h3 className="flex items-center gap-2 text-card-title">
          <Link
            href={`/stores/${order.seller.id}/orders/${order.id}`}
            className="rounded-sm outline-none after:absolute after:inset-0 focus-visible:ring-3 focus-visible:ring-ring"
          >
            {names}
          </Link>
          <UnreadPill count={order.unreadMessages ?? 0} />
        </h3>
        <p className="flex items-center gap-2 text-title-lg font-normal text-muted-foreground">
          <span>
            {order.customerName} · {order.customerPhone}
          </span>
          <span className="relative z-10 flex">
            <CopyPhoneButton phone={order.customerPhone} />
          </span>
        </p>
        {ended && <p className="text-body-sm text-muted-foreground">{ended}</p>}
      </div>
      <div className="flex items-center gap-6 max-md:w-full max-md:justify-between">
        <span className="w-22 rounded-full bg-muted px-4 py-2 text-center text-body-sm-strong">
          {units}
        </span>
        <span aria-hidden className="h-11 w-px bg-border max-md:hidden" />
        <p className="flex w-25 flex-col">
          <span className="text-note text-muted-foreground">{t("amount")}</span>
          <span className="text-card-title">{formatPrice(order.totalVnd)}</span>
        </p>
      </div>
      {(tab === "preparing" || tab === "ready") && (
        <OrderActions orderId={order.id} name={order.customerName} stage={tab} />
      )}
      {tab === "delivered" && <ReopenButton orderId={order.id} />}
      {tab === "cancelled" && why !== "customer" && why !== "expired" && (
        <ReopenButton orderId={order.id} />
      )}
    </li>
  );
}
