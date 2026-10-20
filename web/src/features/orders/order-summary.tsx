import { MapPinIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { formatPrice } from "@/features/offers/format";

import { savingOf, type Order } from "./order";

/** Where and when the order is collected (Figma W1 › Nhận món tại): the counter and the window. */
export function CollectionPlace({
  seller,
  address,
  windowStart,
  windowEnd,
}: {
  seller?: string;
  address: string;
  windowStart: string;
  windowEnd: string;
}) {
  const t = useTranslations("Orders");
  const format = useFormatter();

  return (
    <section
      aria-labelledby="collection-place"
      className="flex flex-col gap-3 rounded-2xl bg-card p-5 text-card-foreground"
    >
      <h2 id="collection-place" className="text-title">
        {t("collectAt")}
      </h2>
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <MapPinIcon aria-hidden className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col">
          {seller ? <p className="text-body-sm-strong">{seller}</p> : null}
          <p className="text-body-sm text-muted-foreground">{address}</p>
          <p className="text-body-sm-strong">
            {t("windowToday", {
              from: format.dateTime(new Date(windowStart), "time"),
              until: format.dateTime(new Date(windowEnd), "time"),
            })}
          </p>
        </div>
      </div>
    </section>
  );
}

/** What the order holds and what it costs, paid to the seller at the counter (Figma W1 › Tóm tắt đơn). */
export function OrderLines({ order }: { order: Order }) {
  const t = useTranslations("Orders");
  const saving = savingOf(order);

  return (
    <section
      aria-labelledby="order-lines"
      className="flex flex-col gap-3 rounded-2xl bg-card p-5 text-card-foreground"
    >
      <h2 id="order-lines" className="text-title">
        {t("summary")}
      </h2>
      <ul className="flex flex-col gap-2">
        {order.lines.map((line) => (
          <li key={line.offerId} className="flex items-baseline justify-between gap-3">
            <span className="text-body-sm">
              {t("line", { units: line.units, name: line.name })}
            </span>
            <span className="font-display text-price">
              {formatPrice(line.priceVnd * line.units)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-baseline justify-between gap-3 border-t border-border pt-3">
        <span className="text-body-sm-strong">{t("total")}</span>
        <span className="font-display text-price-lg text-primary">
          {formatPrice(order.totalVnd)}
        </span>
      </div>
      <p className="text-label text-muted-foreground">
        {saving > 0 ? t("payAtCounterSaving", { saving: formatPrice(saving) }) : t("payAtCounter")}
      </p>
    </section>
  );
}
