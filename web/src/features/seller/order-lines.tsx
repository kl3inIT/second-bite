import Image from "next/image";
import { useTranslations } from "next-intl";

import { formatPrice } from "@/features/offers/format";
import { savingOf, unitsOf } from "@/features/orders/order";
import type { OrderBody } from "@/lib/api/generated";
import { photoUrl } from "@/lib/api/photo";

// The lines of an order and what it comes to (Figma Q5j, Q5k, O2, O3 › Món đã đặt): each dish with its units,
// photo and what the customer pays for it beside the price it had, then the saving, the total, the number and
// how it is paid.
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
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4">
        <Fact label={t("saving")} value={t("savingValue", { amount: formatPrice(saving) })} />
        <Fact label={t("total")} value={formatPrice(order.totalVnd)} end strong />
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
