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
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { BiteCorner } from "@/components/bite-corner";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { directionsHref } from "@/features/offers/offer";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { isOpen, mapOf, savingOf, unitsOf, type Order } from "./order";
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

/** Where the counter is, and the way there in Google Maps (Figma D2 › chỗ nhận). */
export function Directions({ order }: { order: Order }) {
  const t = useTranslations("Orders");
  const locale = useLocale();

  return (
    <section
      aria-label={t("directionsLabel")}
      className="flex flex-col overflow-hidden rounded-2xl bg-card text-card-foreground"
    >
      <iframe
        title={t("mapTitle", { seller: order.seller.name })}
        src={mapOf(order.seller, locale)}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-18 w-full border-0 bg-secondary"
      />
      <div className="flex flex-col gap-3 p-4">
        <div>
          <p className="text-body-sm-strong">
            {t("placeLine", { seller: order.seller.name, address: order.seller.address })}
          </p>
          <p className="text-label text-muted-foreground">{t("placeHint")}</p>
        </div>
        <a
          href={directionsHref(order.seller)}
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

/** The icon of a step (Figma W5 › icon/…): a lime check once done, a white one in a ring now, a dashed ring to come. */
function StepIcon({ state }: { state: StepState }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full",
        state === "now" ? "size-7.5" : "size-5.5",
      )}
    >
      {state === "later" ? (
        <span className="size-full rounded-full border-2 border-dashed border-inverse-faint" />
      ) : (
        <span
          className={cn(
            "flex size-full items-center justify-center rounded-full",
            state === "done" ? "bg-fresh text-header" : "bg-primary-foreground/25",
          )}
        >
          {state === "now" ? (
            <span className="flex size-5.5 items-center justify-center rounded-full bg-primary-foreground text-header">
              <CheckIcon className="size-3" strokeWidth={4} />
            </span>
          ) : (
            <CheckIcon className="size-3" strokeWidth={4} />
          )}
        </span>
      )}
    </span>
  );
}

/**
 * The four steps of an order on the blue band: placed, preparing, ready, collected (Figma W5, W6). Each is a round
 * icon beside its name and time, joined by bars that stretch evenly. Shown from 768px; a phone has its own row.
 */
function WideOrderSteps({ order }: { order: Order }) {
  const t = useTranslations("Orders.steps");
  const format = useFormatter();
  const current = stepOf[order.status] ?? 0;
  const timeOf = (moment?: string) =>
    moment ? format.dateTime(new Date(moment), "time") : undefined;
  // The backend stamps no moment for preparing: an order is confirmed as it is placed.
  const steps: { label: string; time?: string; note?: string; pending?: string }[] = [
    { label: t("placed"), time: timeOf(order.createdAt) },
    { label: t("preparing"), note: t("preparingNote") },
    {
      label: t("ready"),
      time: timeOf(order.readyAt),
      note: t("readyNote"),
      pending: t("readyPending"),
    },
    {
      label: t("received"),
      time: timeOf(order.collectedAt),
      note: t("collectedNote"),
      pending: t("collectedPending"),
    },
  ];

  return (
    <ol aria-label={t("label")} className="flex items-center">
      {steps.map(({ label, time, note, pending }, index) => {
        const state: StepState = index < current ? "done" : index === current ? "now" : "later";
        return (
          <li
            key={label}
            aria-current={state === "now" ? "step" : undefined}
            className={cn("relative flex min-w-0 flex-1 items-center", index === 0 && "flex-none")}
          >
            {index > 0 ? (
              <span
                aria-hidden
                className={cn(
                  "mr-3 h-0.5 flex-1",
                  index <= current ? "bg-fresh" : "bg-inverse-faint/40",
                )}
              />
            ) : null}
            <span className="flex min-w-0 items-center gap-2">
              <StepIcon state={state} />
              <span className="flex min-w-0 flex-col">
                <span
                  className={cn(
                    state === "now" ? "text-title text-primary-foreground" : "text-body-sm",
                    state === "done" && "font-medium text-fresh",
                    state === "later" && "text-inverse-muted",
                  )}
                >
                  {label}
                </span>
                {state === "later" ? (
                  <span className="text-label text-inverse-muted">{pending}</span>
                ) : time || (state === "now" && note) ? (
                  <span
                    className={cn(
                      "text-label text-inverse-muted",
                      state === "now" && "font-medium",
                    )}
                  >
                    {time}
                    {state === "now" && note ? (
                      <span>
                        {time ? " · " : ""}
                        {note}
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** A phone's four steps on the blue band: placed, preparing, ready, collected (Figma K6, K6b). */
function PhoneOrderSteps({ order }: { order: Order }) {
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

/**
 * The order's four steps on the blue band: a phone keeps its own row of icons (Figma K6, K6b); from 768px the
 * steps follow Figma W5 and W6. Only one is shown, so assistive technology reads one list.
 */
export function OrderSteps({ order }: { order: Order }) {
  return (
    <>
      <div className="md:hidden">
        <PhoneOrderSteps order={order} />
      </div>
      <div className="hidden md:block">
        <WideOrderSteps order={order} />
      </div>
    </>
  );
}
