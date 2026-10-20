import {
  CheckIcon,
  CircleDotIcon,
  CircleIcon,
  HashIcon,
  MapPinIcon,
  ShoppingBagIcon,
} from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { cn } from "@/lib/utils";

import { directionsTo, isOpen, unitsOf, type Order } from "./order";

// The pieces the order pages are built from (Figma W2–W6): the seller's row, the collection code, the facts
// of the order, the way to the counter and the steps of collecting.

/** The first line's photograph, small and round, beside the seller's name. */
function LinePhoto({ order }: { order: Order }) {
  const photo = order.lines[0]?.photo;
  return (
    <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
      {photo ? (
        <Image
          src={`/api${photo.smallPath}`}
          alt=""
          fill
          sizes="40px"
          unoptimized
          className="object-cover"
        />
      ) : null}
    </span>
  );
}

/** The seller, its counter and the window today, and how many units the order holds. */
export function SellerRow({ order }: { order: Order }) {
  const t = useTranslations("Orders");
  const format = useFormatter();

  return (
    <div className="flex items-center gap-3">
      <LinePhoto order={order} />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-body-sm-strong">{order.seller.name}</p>
        <p className="truncate text-label text-muted-foreground">
          {t("counterToday", {
            address: order.seller.address,
            from: format.dateTime(new Date(order.windowStart), "time"),
            until: format.dateTime(new Date(order.windowEnd), "time"),
          })}
        </p>
      </div>
      <span className="shrink-0 text-label-strong text-primary">
        {t("units", { units: unitsOf(order) })}
      </span>
    </div>
  );
}

/**
 * The ticket of an open order (Figma W2, W3): the seller, then the four-digit code once it may be shown, or
 * four dots and when it will show. A screen reader hears the code digit by digit.
 */
export function CodeTicket({ order }: { order: Order }) {
  const t = useTranslations("Orders");
  const format = useFormatter();

  return (
    <section
      aria-labelledby="order-code"
      className="flex flex-col gap-4 rounded-3xl bg-card p-5 text-card-foreground"
    >
      <SellerRow order={order} />
      <div className="flex flex-col gap-1 border-t border-dashed border-border pt-4">
        <h2 id="order-code" className="text-label text-muted-foreground">
          {t("code")}
        </h2>
        {order.code ? (
          <>
            <p
              aria-label={order.code.split("").join(" ")}
              className="font-display text-display tracking-widest"
            >
              {order.code}
            </p>
            <p className="text-label text-muted-foreground">{t("codeHint")}</p>
          </>
        ) : (
          <>
            <p aria-hidden className="font-display text-display tracking-widest text-secondary">
              ••••
            </p>
            <p className="text-label text-muted-foreground">
              {t("codeLater", { from: format.dateTime(new Date(order.windowStart), "time") })}
            </p>
          </>
        )}
      </div>
    </section>
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

/** The facts of the order in two columns (Figma W2 › chi tiết): day, window, what, total, number, payment. */
export function OrderFacts({ order, className }: { order: Order; className?: string }) {
  const t = useTranslations("Orders.facts");
  const date = useOrderDate();
  const format = useFormatter();
  const facts: [string, string][] = [
    [t("day"), date(order.windowStart)],
    [
      t("window"),
      `${format.dateTime(new Date(order.windowStart), "time")} – ${format.dateTime(new Date(order.windowEnd), "time")}`,
    ],
    [t("what"), order.lines.map((line) => `${line.units}× ${line.name}`).join(", ")],
    [t("total"), formatPrice(order.totalVnd)],
    [t("number"), order.number],
    [t("payment"), isOpen(order) || order.status === "collected" ? t("atCounter") : t("nothing")],
  ];

  return (
    <dl className={cn("grid grid-cols-2 gap-x-4 gap-y-3", className)}>
      {facts.map(([label, value], index) => (
        <div key={label} className={cn("flex flex-col", index % 2 === 1 && "items-end text-right")}>
          <dt className="text-label text-muted-foreground uppercase">{label}</dt>
          <dd className="text-body-sm-strong">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The facts of an open order, on one card; the code ticket above names the seller. */
export function OrderDetails({ order }: { order: Order }) {
  const t = useTranslations("Orders");

  return (
    <section
      aria-label={t("details")}
      className="flex flex-col gap-4 rounded-3xl bg-card p-5 text-card-foreground"
    >
      <OrderFacts order={order} />
    </section>
  );
}

/** Where the counter is, and the way there in Google Maps (Figma W2 › bản đồ). */
export function Directions({ order }: { order: Order }) {
  const t = useTranslations("Orders");

  return (
    <section
      aria-label={t("directionsLabel")}
      className="flex flex-col overflow-hidden rounded-3xl bg-card text-card-foreground"
    >
      <div
        aria-hidden
        className="flex h-24 items-center justify-center bg-secondary text-secondary-foreground"
      >
        <MapPinIcon className="size-8" />
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

/** The three steps of collecting (Figma W2 › Cách nhận món). */
export function HowToCollect({ order }: { order: Order }) {
  const t = useTranslations("Orders.how");
  const steps = [
    { icon: MapPinIcon, title: t("goTitle"), body: t("goBody", { seller: order.seller.name }) },
    { icon: HashIcon, title: t("codeTitle"), body: t("codeBody") },
    { icon: ShoppingBagIcon, title: t("payTitle"), body: t("payBody") },
  ];

  return (
    <section
      aria-labelledby="how-to-collect"
      className="flex flex-col gap-4 rounded-3xl bg-card p-5 text-card-foreground"
    >
      <h2 id="how-to-collect" className="text-title">
        {t("title")}
      </h2>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, index) => (
          <li key={title} className="flex items-start gap-3 rounded-2xl bg-background p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Icon aria-hidden className="size-4.5" />
            </span>
            <div className="flex flex-col">
              <p className="text-body-sm-strong">
                {index + 1}. {title}
              </p>
              <p className="text-label text-muted-foreground">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

type Step = { label: string; state: "done" | "now" | "later" };

/** The steps of an open order on the blue card: placed, preparing, ready, collected (Figma W2, W3). */
export function OrderSteps({ order }: { order: Order }) {
  const t = useTranslations("Orders.steps");
  const format = useFormatter();
  const ready = order.status === "ready";
  const steps: Step[] = [
    {
      label: t("placed", { time: format.dateTime(new Date(order.createdAt), "time") }),
      state: "done",
    },
    { label: t("preparing"), state: ready ? "done" : "now" },
    {
      label: order.readyAt
        ? t("readyAt", { time: format.dateTime(new Date(order.readyAt), "time") })
        : t("ready"),
      state: ready ? "now" : "later",
    },
    { label: t("collected"), state: "later" },
  ];

  return (
    <ol
      aria-label={t("label")}
      className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:flex sm:flex-wrap sm:gap-x-5"
    >
      {steps.map(({ label, state }) => {
        const Icon = state === "done" ? CheckIcon : state === "now" ? CircleDotIcon : CircleIcon;
        return (
          <li
            key={label}
            aria-current={state === "now" ? "step" : undefined}
            className={cn(
              "flex items-center gap-1.5 text-label",
              state === "done" && "text-fresh",
              state === "now" && "text-label-strong text-primary-foreground",
              state === "later" && "text-inverse-muted",
            )}
          >
            <Icon aria-hidden className="size-3.5" />
            {label}
          </li>
        );
      })}
    </ol>
  );
}
