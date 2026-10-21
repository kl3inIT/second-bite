"use client";

import { BanIcon, CircleCheckIcon, CircleXIcon, EyeOffIcon, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { formatPrice } from "../../offers/format";
import { AdminCrumb } from "../admin-crumbs";
import { adminHref } from "../pages";
import { CancelOrderDialog } from "./cancel-order-dialog";
import {
  type AdminOrder,
  type CancelRequest,
  isOpen,
  orderClock,
  orderStatusLooks,
  orderSteps,
  stepDots,
} from "./order";

type Fact = { key: string; label: string; value: ReactNode };

/**
 * One order (Figma AD-DH3, AD-DH5): its code and state with "Xem cửa hàng" and the action its state allows
 * ("Huỷ đơn" while it is held, "Ghi nhận vi phạm" once the customer did not come), the strip of figures, then
 * the items and the history on the left and the customer, the store and the pickup on the right. `now` is the
 * moment the page was read, for "Còn 38 phút". The actions send through `onCancel` and `onRecordNoShow` once
 * SEC-15's admin API exists; until then their final button is locked ("Sắp có").
 */
export function OrderDetail({
  order,
  now,
  onCancel,
  onRecordNoShow,
}: {
  order: AdminOrder;
  now: Date;
  onCancel?: (request: CancelRequest) => Promise<void>;
  onRecordNoShow?: () => Promise<void>;
}) {
  const t = useTranslations("admin.orders");
  const shell = useTranslations("admin.shell");
  const format = useFormatter();
  const [cancelling, setCancelling] = useState(false);
  const [recording, setRecording] = useState(false);

  const code = t("code", { code: order.code });
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const open = isOpen(order.status);
  const charged = open || order.status === "collected";
  const portions = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const sellerHref = adminHref("sellerDetail", { sellerId: order.seller.id });
  const look = orderStatusLooks[order.status];
  const totalLabel = charged ? t("detail.strip.totalCollect") : t("detail.strip.totalNotCollected");

  async function recordNoShow() {
    if (!onRecordNoShow) return;
    setRecording(true);
    try {
      await onRecordNoShow();
      toast.add({
        title: t("detail.recorded", { code: order.code }),
        type: "success",
        timeout: 5000,
      });
    } catch {
      toast.add({ title: t("detail.failed"), type: "error", timeout: 5000 });
    } finally {
      setRecording(false);
    }
  }

  const record = (
    <Button
      variant="destructive"
      disabled={!onRecordNoShow || recording}
      onClick={() => void recordNoShow()}
    >
      {t("detail.recordNoShow")}
    </Button>
  );

  const strip = [
    { label: totalLabel, value: formatPrice(order.totalVnd) },
    { label: t("detail.strip.quantity"), value: portions },
    {
      label: t("detail.strip.window", { day: format.dateTime(new Date(order.pickupStart), "day") }),
      value: t("window", { start: time(order.pickupStart), end: time(order.pickupEnd) }),
    },
    clockItem(order, now, { t, time }),
  ];

  const sideCards: { key: string; title: string; facts: Fact[] }[] = [
    {
      key: "customer",
      title: t("detail.customer.title"),
      facts: [
        { key: "name", label: t("detail.customer.name"), value: order.customer.name },
        { key: "phone", label: t("detail.customer.phone"), value: order.customer.phone },
        { key: "email", label: t("detail.customer.email"), value: order.customer.email },
        {
          key: "previous",
          label: t("detail.customer.previous"),
          value: t("detail.customer.previousValue", {
            collected: order.customer.collectedBefore,
            noShow: order.customer.noShowBefore,
          }),
        },
      ],
    },
    {
      key: "seller",
      title: t("detail.seller.title"),
      facts: [
        { key: "name", label: t("detail.seller.name"), value: order.seller.name },
        { key: "location", label: t("detail.seller.location"), value: order.seller.location },
        { key: "phone", label: t("detail.seller.phone"), value: order.seller.phone },
        {
          key: "status",
          label: t("detail.seller.status"),
          value: shell(`status.${order.seller.status}`),
        },
      ],
    },
    {
      key: "pickup",
      title: t("detail.pickup.title"),
      facts: [
        {
          key: "method",
          label: t("detail.pickup.method"),
          value: t("detail.pickup.methodValue"),
        },
        {
          key: "payment",
          label: t("detail.pickup.payment"),
          value: open
            ? t("detail.pickup.paymentOpen")
            : order.status === "collected"
              ? t("detail.pickup.paymentCollected")
              : t("detail.pickup.paymentNone"),
        },
        {
          key: "code",
          label: t("detail.pickup.code"),
          value: open
            ? t("detail.pickup.codeOpen")
            : order.status === "collected"
              ? t("detail.pickup.codeUsed")
              : t("detail.pickup.codeVoid"),
        },
        {
          key: "attempts",
          label: t("detail.pickup.attempts"),
          value: t("detail.pickup.attemptsValue", {
            count: order.wrongCodeAttempts,
            max: order.maxCodeAttempts,
          }),
        },
      ],
    },
  ];

  const steps = orderSteps(order);

  return (
    <>
      <AdminCrumb label={code} />
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-page-title text-foreground">{code}</h1>
          <Badge variant={look.variant}>
            {look.icon && <look.icon aria-hidden />}
            {t(`status.${order.status}`)}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={sellerHref} className={buttonVariants({ variant: "outline" })}>
            {t("detail.viewSeller")}
          </Link>
          {open && (
            <Button variant="destructive" onClick={() => setCancelling(true)}>
              <BanIcon data-icon="inline-start" aria-hidden />
              {t("detail.cancel")}
            </Button>
          )}
          {order.status === "expired" &&
            (onRecordNoShow ? (
              record
            ) : (
              // A disabled button takes no pointer, so "Sắp có" sits on what holds it.
              <Tooltip>
                <TooltipTrigger render={<span />}>{record}</TooltipTrigger>
                <TooltipContent>{shell("soon")}</TooltipContent>
              </Tooltip>
            ))}
        </div>
      </div>

      <Card>
        <CardContent>
          <dl className="grid grid-cols-2 gap-y-3 md:flex">
            {strip.map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-1 flex-col-reverse items-center gap-0.5 text-center md:border-l md:border-border md:first:border-l-0"
              >
                <dt className="text-label text-muted-foreground">{label}</dt>
                <dd className="font-display text-price-lg text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2>{t("detail.items.title")}</h2>
              </CardTitle>
              <CardAction>
                <Link
                  href={`${sellerHref}?tab=posts`}
                  className={buttonVariants({ variant: "link", size: "inline" })}
                >
                  {t("detail.items.viewPosts")}
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <ul className="flex flex-col">
                  {order.items.map((item) => {
                    const original = formatPrice(item.originalPriceVnd * item.quantity);
                    return (
                      <li
                        key={item.offerId}
                        className="flex items-center gap-3.5 border-t border-border py-3"
                      >
                        {item.photoUrl ? (
                          <Image
                            src={item.photoUrl}
                            alt=""
                            width={100}
                            height={100}
                            unoptimized
                            className="size-25 shrink-0 rounded-md object-cover"
                          />
                        ) : (
                          <span aria-hidden className="size-25 shrink-0 rounded-md bg-muted" />
                        )}
                        <div className="flex min-w-0 flex-col gap-1.5">
                          <h3 className="text-title-lg text-foreground">{item.name}</h3>
                          <p className="flex items-baseline gap-1.5">
                            <span className="font-display text-price text-primary">
                              {formatPrice(item.priceVnd * item.quantity)}
                            </span>
                            <s aria-hidden className="text-label text-muted-foreground">
                              {original}
                            </s>
                            <span className="sr-only">
                              {t("detail.items.originalPrice", { price: original })}
                            </span>
                          </p>
                          <p className="text-body-sm text-muted-foreground">
                            {t("detail.items.quantity", { quantity: item.quantity })}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <dl className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-body-sm text-muted-foreground">
                      {t("detail.items.payBy")}
                    </dt>
                    <dd className="text-right text-body-sm-strong text-foreground">
                      {t("detail.items.payByValue")}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-body-sm-strong text-muted-foreground">{totalLabel}</dt>
                    <dd className="font-display text-price-lg text-foreground">
                      {formatPrice(order.totalVnd)}
                    </dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <h2>{t("detail.history.title")}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col">
                {steps.map((step, index) => (
                  <li key={step.key} className="relative flex items-start gap-3 pb-4 last:pb-0">
                    {index < steps.length - 1 && (
                      <span aria-hidden className="absolute top-3 bottom-0 left-1 w-px bg-border" />
                    )}
                    <span
                      aria-hidden
                      className={cn(
                        "relative mt-1.5 size-2.5 shrink-0 rounded-full",
                        stepDots[step.tone],
                      )}
                    />
                    <span className="min-w-0 flex-1 text-body-sm-strong text-foreground">
                      {t(`detail.history.${step.kind}`)}
                    </span>
                    <time dateTime={step.at} className="shrink-0 text-label text-muted-foreground">
                      {time(step.at)}, {format.dateTime(new Date(step.at), "day")}
                    </time>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-5 lg:w-90 lg:shrink-0">
          {order.status === "expired" && (
            <Alert variant="destructive">
              <BanIcon aria-hidden />
              <AlertTitle>{t("detail.noShow.title")}</AlertTitle>
              <AlertDescription>
                <ul className="flex flex-col gap-2">
                  {noShowLines(order, t).map(({ icon: Icon, text }) => (
                    <li key={text} className="flex gap-2">
                      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          {sideCards.map((card) => (
            <Card key={card.key}>
              <CardHeader>
                <CardTitle>
                  <h2>{card.title}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="flex flex-col gap-3">
                  {card.facts.map((fact) => (
                    <div key={fact.key} className="flex items-start justify-between gap-3">
                      <dt className="shrink-0 text-body-sm text-muted-foreground">{fact.label}</dt>
                      <dd className="min-w-0 text-right text-body-sm-strong break-words text-foreground">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {open && (
        <CancelOrderDialog
          code={order.code}
          open={cancelling}
          onOpenChange={setCancelling}
          onCancel={onCancel}
        />
      )}
    </>
  );
}

type Words = ReturnType<typeof useTranslations<"admin.orders">>;

// The strip's last figure: how long the order is still held, or how and when it ended.
function clockItem(
  order: AdminOrder,
  now: Date,
  { t, time }: { t: Words; time: (at: string) => string },
) {
  const clock = orderClock(order, now);
  const closedAt = order.closedAt ?? order.pickupEnd;
  if (clock.kind === "held") {
    return {
      label: t("detail.strip.heldUntil", { time: time(order.pickupEnd) }),
      value: t("detail.strip.minutesLeft", { minutes: clock.minutesLeft }),
    };
  }
  if (clock.kind === "overdue") {
    return {
      label: t("detail.strip.heldUntil", { time: time(order.pickupEnd) }),
      value: t("detail.strip.overdue"),
    };
  }
  if (clock.status === "expired") {
    return {
      label: t("detail.strip.expiredAt", { time: time(closedAt) }),
      value: t("detail.strip.overdue"),
    };
  }
  return {
    label: t("detail.strip.closedAt", { time: time(closedAt) }),
    value: t(`status.${clock.status}`),
  };
}

// What a no-show means (AD-DH5): nothing collected, how often the customer did it, and that it can be recorded.
function noShowLines(order: AdminOrder, t: Words): { icon: LucideIcon; text: string }[] {
  const lines = [{ icon: CircleXIcon, text: t("detail.noShow.noCharge") }];
  if (order.customer.noShowsIn30Days) {
    lines.push({
      icon: EyeOffIcon,
      text: t("detail.noShow.repeat", { count: order.customer.noShowsIn30Days }),
    });
  }
  lines.push({ icon: CircleCheckIcon, text: t("detail.noShow.canRecord") });
  return lines;
}
