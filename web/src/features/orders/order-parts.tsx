import {
  CheckIcon,
  ChevronRightIcon,
  MapPinIcon,
  QrCodeIcon,
  ReceiptTextIcon,
  ShoppingBagIcon,
  StoreIcon,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import { BiteCorner } from "@/components/bite-corner";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { directionsTo, isOpen, savingOf, unitsOf, type Order } from "./order";
import { OrderQr } from "./order-qr";

// The pieces the order pages are built from (Figma K6, K6b, D5): the seller's row, the ticket, the orders placed
// together, the dishes and totals, the way to the counter, the steps on the blue band and how to collect.

/** A photograph of a line, or the muted ground where it has none. */
function Photo({ path, sizes, className }: { path?: string; sizes: string; className: string }) {
  return (
    <span className={cn("relative shrink-0 overflow-hidden bg-muted", className)}>
      {path ? (
        <Image src={`/api${path}`} alt="" fill sizes={sizes} unoptimized className="object-cover" />
      ) : null}
    </span>
  );
}

/** The seller, its counter and the window today, and how many units the order holds (Figma D2 › store). */
export function SellerRow({ order }: { order: Order }) {
  const t = useTranslations("Orders");
  const format = useFormatter();

  return (
    <div className="flex items-center gap-3">
      <Photo
        path={order.lines[0]?.photo.smallPath}
        sizes="40px"
        className="size-10 rounded-full border-2 border-card"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-title">{order.seller.name}</p>
        <p className="truncate text-label text-muted-foreground">
          {t("counterToday", {
            address: order.seller.address,
            from: format.dateTime(new Date(order.windowStart), "time"),
            until: format.dateTime(new Date(order.windowEnd), "time"),
          })}
        </p>
      </div>
      <span className="shrink-0 text-body-sm-strong text-primary">
        {t("units", { units: unitsOf(order) })}
      </span>
    </div>
  );
}

/**
 * The ticket of an open order (Figma K6): the seller above a torn edge, then the order's QR code once it is ready,
 * or a pale one until then, beside how to collect it: the code, or the name and phone number read out (SEC-86);
 * under them the other sellers' orders placed with it.
 */
export function CollectTicket({ order, together }: { order: Order; together: Order[] }) {
  const t = useTranslations("Orders");
  const ready = order.status === "ready";

  return (
    <section
      aria-labelledby={`order-collect-${order.id}`}
      className="relative flex flex-col gap-3.5 overflow-hidden rounded-3xl bg-card p-5 text-card-foreground"
    >
      <BiteCorner className="size-16" />
      <SellerRow order={order} />
      <div aria-hidden className="relative border-t border-dashed border-border">
        <span className="absolute -top-2.75 -left-7.75 size-5.5 rounded-full bg-background" />
        <span className="absolute -top-2.75 -right-7.75 size-5.5 rounded-full bg-background" />
      </div>
      <div className="flex items-center gap-5">
        {ready ? (
          <OrderQr orderId={order.id} />
        ) : (
          <span
            aria-hidden
            className="flex size-30 shrink-0 items-center justify-center rounded-md bg-muted text-border"
          >
            <QrCodeIcon className="size-20" strokeWidth={1.2} />
          </span>
        )}
        <h2 id={`order-collect-${order.id}`} className="min-w-0 text-body-sm text-muted-foreground">
          {ready ? t("collectReady") : t("collectLater")}
        </h2>
      </div>
      <TogetherLinks together={together} />
    </section>
  );
}

/** "Cùng lần đặt: Panda Chef ›", a link to each other seller's order placed from the same cart (SEC-97 › decision 4). */
export function TogetherLinks({ together }: { together: Order[] }) {
  const t = useTranslations("Orders");
  if (together.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1">
      {together.map((other) => (
        <li key={other.id}>
          <Link
            href={`/orders/${other.id}`}
            className="inline-flex min-h-11 items-center gap-0.5 rounded-sm text-label-strong text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
          >
            {t("placedWith", { seller: other.seller.name })}
            <ChevronRightIcon aria-hidden className="size-4" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** "20/10", the day an order is collected, in both languages. */
export function useOrderDate() {
  const t = useTranslations("Orders");
  const format = useFormatter();
  return (value: string) =>
    t("date", {
      day: format.dateTime(new Date(value), "dayOfMonth"),
      month: format.dateTime(new Date(value), "monthOfYear"),
    });
}

/** A label above its value, at the start or the end of a row of two. */
function Fact({ label, value, end }: { label: string; value: React.ReactNode; end?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-0.5", end && "items-end text-right")}>
      <dt className="text-label-strong text-muted-foreground uppercase">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

/**
 * What was ordered and what it came to (Figma D2 › món trong đơn): each line with its photograph, price and
 * original price, then the saving and the total, the number and how it is paid.
 */
export function OrderSummary({ order }: { order: Order }) {
  const t = useTranslations("Orders");
  const paid = isOpen(order) || order.status === "collected";

  return (
    <div className="flex flex-col gap-3.5">
      <h3 className="text-label-strong text-muted-foreground uppercase">
        {t("ordered", { units: unitsOf(order) })}
      </h3>
      <ul className="flex flex-col gap-3.5">
        {order.lines.map((line) => (
          <li key={line.offerId} className="flex items-center gap-2.5 py-0.5 pr-1">
            <span className="w-5.5 shrink-0 font-display text-price">{line.units}×</span>
            <Photo path={line.photo.smallPath} sizes="36px" className="size-9 rounded-md" />
            <span className="line-clamp-2 min-w-0 flex-1 text-body-sm">{line.name}</span>
            <span className="flex shrink-0 flex-col items-end">
              <span className="font-display text-price text-primary">
                {formatPrice(line.priceVnd * line.units)}
              </span>
              <s className="text-label text-muted-foreground">
                <span className="sr-only">{t("originalPrice")}</span>
                {formatPrice(line.originalPriceVnd * line.units)}
              </s>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-3.5 border-t border-border pt-3.5">
        <dl className="flex justify-between gap-4">
          <Fact
            label={t("facts.saved")}
            value={
              <span className="text-body-sm">
                {t("facts.savedValue", { saved: formatPrice(savingOf(order)) })}
              </span>
            }
          />
          <Fact
            end
            label={t("facts.total")}
            value={<span className="font-display text-price">{formatPrice(order.totalVnd)}</span>}
          />
        </dl>
        <dl className="flex justify-between gap-4">
          <Fact
            label={t("facts.number")}
            value={<span className="text-body-sm">#{order.number}</span>}
          />
          <Fact
            end
            label={t("facts.payment")}
            value={
              <span className="text-body-sm">
                {paid ? t("facts.atCounter") : t("facts.nothing")}
              </span>
            }
          />
        </dl>
      </div>
    </div>
  );
}

/** Where the counter is, and the way there in Google Maps (Figma D2 › chỗ lấy). */
export function Directions({ order }: { order: Order }) {
  const t = useTranslations("Orders");

  return (
    <section
      aria-label={t("directionsLabel")}
      className="flex flex-col overflow-hidden rounded-2xl bg-card text-card-foreground"
    >
      <div
        aria-hidden
        className="flex h-18 items-center justify-center bg-secondary text-secondary-foreground"
      >
        <MapPinIcon className="size-7" />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div>
          <p className="text-body-sm-strong">
            {t("placeLine", { seller: order.seller.name, address: order.seller.address })}
          </p>
          <p className="text-label text-muted-foreground">{t("placeHint")}</p>
        </div>
        <a
          href={directionsTo(order.seller)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants()}
        >
          {t("directions")}
          <span className="sr-only">{t("opensMaps")}</span>
        </a>
      </div>
    </section>
  );
}

/** The three steps of collecting a ready order, joined by dotted lines (Figma D3 › Cách nhận món). */
export function HowToCollect({ order }: { order: Order }) {
  const t = useTranslations("Orders.how");
  const steps: { icon: LucideIcon; title: string; body: string }[] = [
    { icon: MapPinIcon, title: t("goTitle"), body: order.seller.address },
    { icon: QrCodeIcon, title: t("qrTitle"), body: t("qrBody") },
    { icon: ShoppingBagIcon, title: t("takeTitle"), body: t("takeBody") },
  ];

  return (
    <section
      aria-labelledby={`how-to-collect-${order.id}`}
      className="flex flex-col gap-2 rounded-2xl bg-card px-4 pt-3 pb-4 text-card-foreground"
    >
      <h2 id={`how-to-collect-${order.id}`} className="text-title">
        {t("title")}
      </h2>
      <ol className="grid grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, index) => (
          <li key={title} className="relative flex flex-col items-center gap-1.5 text-center">
            {index > 0 ? (
              <span
                aria-hidden
                className="absolute top-4.5 right-1/2 w-full border-t-2 border-dotted border-secondary-hover"
              />
            ) : null}
            <span className="relative flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
              <Icon aria-hidden className="size-4" />
            </span>
            <p className="text-label-strong">{title}</p>
            <p className="text-label text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

type StepState = "done" | "now" | "later";

// The step each status stands at: a confirmed order is being prepared, as the backend has no separate status
// (SEC-97 › decision 5).
const stepOf: Partial<Record<Order["status"], number>> = { confirmed: 1, ready: 2, collected: 3 };

/** The four steps of an order on the blue band: placed, preparing, ready, collected (Figma K6, K6b). */
export function OrderSteps({ order }: { order: Order }) {
  const t = useTranslations("Orders.steps");
  const current = stepOf[order.status] ?? 0;
  const collected = order.status === "collected";
  const stateAt = (index: number): StepState => {
    if (index < current || (collected && index === current)) return "done";
    return index === current ? "now" : "later";
  };
  const steps: { icon: LucideIcon; label: string; state: StepState }[] = [
    { icon: ReceiptTextIcon, label: t("placed"), state: stateAt(0) },
    { icon: StoreIcon, label: t("preparing"), state: stateAt(1) },
    { icon: ShoppingBagIcon, label: t("ready"), state: stateAt(2) },
    { icon: CheckIcon, label: t("collected"), state: stateAt(3) },
  ];

  return (
    <ol aria-label={t("label")} className="flex items-start">
      {steps.map(({ icon: Icon, label, state }, index) => (
        <li
          key={label}
          aria-current={index === current ? "step" : undefined}
          className="relative flex flex-1 flex-col items-center gap-1.5"
        >
          {index > 0 ? (
            <span
              aria-hidden
              className={cn(
                "absolute top-3.5 right-1/2 h-0.75 w-full",
                state === "later" ? "bg-primary-foreground/15" : "bg-fresh",
              )}
            />
          ) : null}
          <span
            className={cn(
              "relative flex size-8 items-center justify-center rounded-full",
              state === "later"
                ? "bg-primary-foreground/15 text-inverse-muted"
                : "bg-fresh text-fresh-foreground",
              state === "now" && "ring-3 ring-primary-foreground",
            )}
          >
            <Icon aria-hidden className="size-4" />
          </span>
          <span
            className={cn(
              "text-label",
              index === current ? "text-label-strong text-fresh" : "text-inverse-muted",
            )}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}
