"use client";

import { BanIcon, CircleCheckIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

import { formatPrice } from "../../offers/format";
import { AdminCrumb } from "../admin-crumbs";
import { showAdminToast } from "../lib/toast";
import { adminHref } from "../pages";
import { InfoStrip } from "../ui/info-strip";
import { StatusCard, type StatusLine } from "../ui/status-card";
import { Timeline } from "../ui/timeline";
import { CancelOrderDialog } from "./cancel-order-dialog";
import { DetailCard, DetailList } from "./detail-card";
import { type AdminOrder, type CancelRequest, isOpen, orderClock, orderSteps } from "./order";
import { OrderStatusBadge } from "./order-status-badge";

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

  async function recordNoShow() {
    if (!onRecordNoShow) return;
    setRecording(true);
    try {
      await onRecordNoShow();
      showAdminToast(t("detail.recorded", { code: order.code }));
    } catch {
      showAdminToast(t("detail.failed"), "error");
    } finally {
      setRecording(false);
    }
  }

  return (
    <>
      <AdminCrumb label={code} />
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-page-title text-foreground">{code}</h1>
          <OrderStatusBadge status={order.status} />
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
          {order.status === "expired" && (
            <Button
              variant="destructive"
              disabled={!onRecordNoShow || recording}
              title={onRecordNoShow ? undefined : shell("soon")}
              onClick={() => void recordNoShow()}
            >
              {t("detail.recordNoShow")}
            </Button>
          )}
        </div>
      </div>

      <InfoStrip
        items={[
          {
            label: charged ? t("detail.strip.totalCollect") : t("detail.strip.totalNotCollected"),
            value: formatPrice(order.totalVnd),
          },
          { label: t("detail.strip.quantity"), value: portions },
          {
            label: t("detail.strip.window", {
              day: format.dateTime(new Date(order.pickupStart), "day"),
            }),
            value: t("window", { start: time(order.pickupStart), end: time(order.pickupEnd) }),
          },
          clockItem(order, now, { t, time }),
        ]}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <DetailCard
            title={t("detail.items.title")}
            action={
              <Link
                href={`${sellerHref}?tab=posts`}
                className="rounded-sm text-body-sm-strong text-link hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {t("detail.items.viewPosts")}
              </Link>
            }
          >
            <ul className="-mt-1.5 flex flex-col">
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
                <dt className="text-body-sm text-muted-foreground">{t("detail.items.payBy")}</dt>
                <dd className="text-right text-body-sm-strong text-foreground">
                  {t("detail.items.payByValue")}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-body-sm-strong text-muted-foreground">
                  {charged ? t("detail.strip.totalCollect") : t("detail.strip.totalNotCollected")}
                </dt>
                <dd className="font-display text-price-lg text-foreground">
                  {formatPrice(order.totalVnd)}
                </dd>
              </div>
            </dl>
          </DetailCard>

          <DetailCard title={t("detail.history.title")}>
            <Timeline
              events={orderSteps(order).map((step) => ({
                key: step.key,
                title: t(`detail.history.${step.kind}`),
                at: step.at,
                tone: step.tone,
              }))}
            />
          </DetailCard>
        </div>

        <div className="flex flex-col gap-5 lg:w-90 lg:shrink-0">
          {order.status === "expired" && (
            <StatusCard
              title={t("detail.noShow.title")}
              tone="error"
              lines={noShowLines(order, t)}
            />
          )}
          <DetailCard title={t("detail.customer.title")}>
            <DetailList
              facts={[
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
              ]}
            />
          </DetailCard>
          <DetailCard title={t("detail.seller.title")}>
            <DetailList
              facts={[
                { key: "name", label: t("detail.seller.name"), value: order.seller.name },
                {
                  key: "location",
                  label: t("detail.seller.location"),
                  value: order.seller.location,
                },
                { key: "phone", label: t("detail.seller.phone"), value: order.seller.phone },
                {
                  key: "status",
                  label: t("detail.seller.status"),
                  value: shell(`status.${order.seller.status}`),
                },
              ]}
            />
          </DetailCard>
          <DetailCard title={t("detail.pickup.title")}>
            <DetailList
              facts={[
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
              ]}
            />
          </DetailCard>
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
function noShowLines(order: AdminOrder, t: Words): StatusLine[] {
  const lines: StatusLine[] = [{ icon: BanIcon, text: t("detail.noShow.noCharge") }];
  if (order.customer.noShowsIn30Days) {
    lines.push({
      icon: EyeOffIcon,
      text: t("detail.noShow.repeat", { count: order.customer.noShowsIn30Days }),
    });
  }
  lines.push({ icon: CircleCheckIcon, text: t("detail.noShow.canRecord"), tone: "success" });
  return lines;
}
