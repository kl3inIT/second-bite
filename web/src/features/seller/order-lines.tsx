import { GiftIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { formatPrice } from "@/features/offers/format";
import { savingOf, unitsOf } from "@/features/orders/order";
import type { OrderBody } from "@/lib/api/generated";
import { photoUrl } from "@/lib/api/photo";

// The lines of an order and what it comes to (Figma Q5j, Q5k, O2, O3 › Món đã đặt): each dish with its units,
// photo and what the customer pays for it beside the price it had, then the saving, the total, the number and
// how it is paid. A promotion's discount shows what to collect and that Second Bite pays it back
// (buyer-discount increment).
export function OrderLines({ order }: { order: OrderBody }) {
  const t = useTranslations("StoreOrders.detail");
  const saving = savingOf(order);

  return (
    <section
      aria-labelledby={`order-lines-${order.id}`}
      className="flex flex-col gap-3.5 rounded-3xl bg-card p-5 text-card-foreground"
    >
      <h2
        id={`order-lines-${order.id}`}
        className="text-label tracking-wider text-muted-foreground uppercase"
      >
        {t("lines", { count: unitsOf(order) })}
      </h2>
      <ul className="flex flex-col gap-3">
        {order.lines.map((line) => (
          <li key={line.offerId} className="flex items-center gap-3">
            <span className="w-7 shrink-0 font-display text-title">{line.units}×</span>
            <span className="relative size-10 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={photoUrl(line.photo.smallPath)}
                alt=""
                fill
                sizes="40px"
                unoptimized
                className="object-cover"
              />
            </span>
            <span className="min-w-0 flex-1 text-body-sm-strong">{line.name}</span>
            <span className="flex shrink-0 flex-col items-end">
              <span className="font-display text-title text-primary">
                {formatPrice(line.priceVnd * line.units)}
              </span>
              <span className="text-label text-muted-foreground line-through">
                {formatPrice(line.originalPriceVnd * line.units)}
              </span>
            </span>
          </li>
        ))}
      </ul>
      {order.promotion && order.discountVnd > 0 && (
        <div className="flex flex-col gap-2.5 border-t border-border pt-4">
          <p className="flex items-end justify-between gap-3 rounded-2xl bg-secondary px-4 py-3 text-secondary-foreground">
            <span className="flex flex-col">
              <span className="text-label uppercase">{t("collect")}</span>
              <span className="font-display text-price-lg">{formatPrice(order.payVnd)}</span>
            </span>
            <span className="text-label">
              {t("instead", { total: formatPrice(order.totalVnd) })}
            </span>
          </p>
          <p className="flex gap-2 rounded-xl bg-fresh-muted px-3 py-2.5 text-body-sm text-fresh-foreground">
            <GiftIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
            {t("payback", {
              amount: formatPrice(order.discountVnd),
              promotion: order.promotion.name,
            })}
          </p>
        </div>
      )}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4">
        <Fact label={t("saving")} value={t("savingValue", { amount: formatPrice(saving) })} />
        <Fact
          label={order.discountVnd > 0 ? t("collect") : t("total")}
          value={formatPrice(order.payVnd)}
          end
          strong
        />
        <Fact label={t("number")} value={`#${order.number}`} />
        <Fact label={t("payment")} value={t("atCounter")} end />
      </dl>
    </section>
  );
}

function Fact({
  label,
  value,
  end,
  strong,
}: {
  label: string;
  value: string;
  end?: boolean;
  strong?: boolean;
}) {
  return (
    <div className={end ? "flex flex-col items-end text-right" : "flex flex-col"}>
      <dt className="text-label text-muted-foreground uppercase">{label}</dt>
      <dd className={strong ? "font-display text-title" : "text-body-sm-strong"}>{value}</dd>
    </div>
  );
}
