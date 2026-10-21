import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { OrderStatusBadge } from "@/features/admin-orders/order-status";
import { TimeLeft } from "@/features/admin-orders/time-left";
import { shownPhone, StatusBadge } from "@/features/admin-sellers/seller-parts";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { getOrder, getSeller, type OrderBody, type SellerBody } from "@/lib/api/generated";
import { photoUrl } from "@/lib/api/photo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.orders");
  return { title: t("title") };
}

/** An order whose food is not paid for: it ended without being handed over. */
const notTaken = new Set<OrderBody["status"]>(["expired", "cancelled", "refused"]);

/** The store's own record, or none when it is gone: the page then shows what the order copied. */
async function readSeller(
  headers: Awaited<ReturnType<typeof sessionHeaders>>,
  sellerId: string,
): Promise<SellerBody | null> {
  try {
    return (await getSeller({ headers, path: { sellerId } })).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// An order's page for an admin (Figma AD-DH3, AD-DH5, SEC-135): its number and status with a way to its
// store, a strip of what it comes to, its lines and history, and who collects it, from which store and where.
// It shows only what GET /orders/{orderId} answers, and the store's phone and status from its own record.
// Admins read orders and never act for a store: cancelling is not offered.
export default async function OrderPage({ params }: PageProps<"/[locale]/admin/orders/[orderId]">) {
  const { orderId } = await params;
  await requireAdmin(`/admin/orders/${orderId}`);
  const [t, format, headers] = await Promise.all([
    getTranslations("Admin"),
    getFormatter(),
    sessionHeaders(),
  ]);

  let order: OrderBody;
  try {
    order = (await getOrder({ headers, path: { orderId } })).data;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 400 || error.status === 404)) notFound();
    throw error;
  }
  const seller = await readSeller(headers, order.seller.id);

  const time = (at: string) => format.dateTime(new Date(at), "time");
  const day = (at: string) => format.dateTime(new Date(at), "day");
  const at = (when: string) =>
    t("orders.detail.at", { time: time(when), day: format.dateTime(new Date(when), "dayMonth") });
  const units = order.lines.reduce((sum, l) => sum + l.units, 0);
  const window = t("orders.window", {
    from: time(order.windowStart),
    until: time(order.windowEnd),
  });
  const open = order.status === "confirmed" || order.status === "ready";

  const history: Array<{ key: string; label: string; value: string; done: boolean }> = [
    {
      key: "placed",
      label: t("orders.detail.event.placed"),
      value: at(order.createdAt),
      done: true,
    },
    {
      key: "ready",
      label: t("orders.detail.event.ready"),
      value: order.readyAt ? at(order.readyAt) : t("orders.detail.notYet"),
      done: Boolean(order.readyAt),
    },
    {
      key: "collected",
      label: t("orders.detail.event.collected"),
      value: order.collectedAt
        ? at(order.collectedAt)
        : open
          ? t("orders.detail.notYet")
          : t("orders.detail.never"),
      done: Boolean(order.collectedAt),
    },
    ...(open
      ? [
          {
            key: "due",
            label: t("orders.detail.event.due"),
            value: at(order.windowEnd),
            done: false,
          },
        ]
      : []),
    ...(order.status === "expired"
      ? [
          {
            key: "expired",
            label: t("orders.detail.event.expired"),
            value: at(order.windowEnd),
            done: true,
          },
        ]
      : []),
    ...(order.cancelledAt
      ? [
          {
            key: "cancelled",
            label: t("orders.detail.event.cancelled"),
            value: at(order.cancelledAt),
            done: true,
          },
        ]
      : []),
    ...(order.refusedAt
      ? [
          {
            key: "refused",
            label: t("orders.detail.event.refused"),
            value: at(order.refusedAt),
            done: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <AdminTopBar
        crumbs={[
          { label: t("group.operations") },
          { label: t("orders.title"), href: "/admin/orders" },
          { label: order.number },
        ]}
      />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-headline text-foreground">{order.number}</h1>
          <OrderStatusBadge status={order.status} />
          <Link
            href={`/admin/sellers/${order.seller.id}`}
            className={buttonVariants({ variant: "outline", className: "ms-auto" })}
          >
            {t("orders.detail.seeStore")}
          </Link>
        </div>
        <Card size="lg">
          <CardContent>
            <h2 className="sr-only">{t("orders.detail.strip")}</h2>
            <dl className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <dt className="text-body-sm text-muted-foreground">
                  {notTaken.has(order.status)
                    ? t("orders.detail.totalNotTaken")
                    : t("orders.detail.total")}
                </dt>
                <dd className="font-display text-title text-foreground">
                  {formatPrice(order.totalVnd)}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-body-sm text-muted-foreground">{t("orders.detail.units")}</dt>
                <dd className="font-display text-title text-foreground">{units}</dd>
                <dd className="text-body-sm text-muted-foreground">
                  {t("orders.detail.unitsNote", { count: order.lines.length })}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-body-sm text-muted-foreground">{t("orders.detail.window")}</dt>
                <dd className="font-display text-title text-foreground">{window}</dd>
                <dd className="text-body-sm text-muted-foreground">{day(order.windowStart)}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-body-sm text-muted-foreground">{t("orders.detail.held")}</dt>
                <TimeLeft order={order} />
              </div>
            </dl>
          </CardContent>
        </Card>
        <div className="grid flex-1 items-start gap-5 lg:grid-cols-3">
          <div className="flex flex-col gap-5 lg:col-span-2">
            <Card size="lg">
              <CardHeader>
                <CardTitle>{t("orders.detail.lines")}</CardTitle>
                <CardAction>
                  <span className="text-body-sm text-muted-foreground">
                    {t("orders.detail.linesCount", { lines: order.lines.length, units })}
                  </span>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-4">
                    {order.lines.map((line) => (
                      <li key={line.offerId} className="flex items-center gap-4">
                        <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={photoUrl(line.photo.smallPath)}
                            alt=""
                            fill
                            sizes="56px"
                            unoptimized
                            className="object-cover"
                          />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="text-body-sm-strong text-foreground">{line.name}</span>
                          <span className="text-body-sm">
                            {formatPrice(line.priceVnd)}{" "}
                            <s className="text-muted-foreground">
                              <span className="sr-only">{t("orders.detail.originalPrice")} </span>
                              {formatPrice(line.originalPriceVnd)}
                            </s>
                          </span>
                          <span className="text-body-sm text-muted-foreground">
                            {t("orders.detail.lineUnits", {
                              units: line.units,
                              unit: line.unit,
                              discount: Math.round(
                                (1 - line.priceVnd / line.originalPriceVnd) * 100,
                              ),
                            })}
                          </span>
                        </span>
                        <span className="text-body-sm-strong whitespace-nowrap text-foreground">
                          {formatPrice(line.priceVnd * line.units)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Separator />
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-body-sm-strong text-foreground">
                      {t("orders.detail.linesTotal")}
                    </span>
                    <span className="font-display text-title text-foreground">
                      {formatPrice(order.totalVnd)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card size="lg">
              <CardHeader>
                <CardTitle>{t("orders.detail.history")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="flex flex-col gap-3">
                  {history.map((event) => (
                    <li key={event.key} className="flex items-center justify-between gap-4">
                      <span className={event.done ? "text-foreground" : "text-muted-foreground"}>
                        {event.label}
                      </span>
                      <span className="text-end text-body-sm-strong">{event.value}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-5">
            <Card size="lg">
              <CardHeader>
                <CardTitle>{t("orders.detail.customer")}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="flex flex-col gap-2 text-body-sm">
                  <Fact label={t("orders.detail.name")} value={order.customerName} />
                  <Fact label={t("orders.detail.phone")} value={shownPhone(order.customerPhone)} />
                </dl>
              </CardContent>
            </Card>
            <Card size="lg">
              <CardHeader>
                <CardTitle>{t("orders.detail.store")}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="flex flex-col gap-2 text-body-sm">
                  <Fact label={t("orders.detail.name")} value={seller?.name ?? order.seller.name} />
                  <Fact
                    label={t("orders.detail.address")}
                    value={seller?.address ?? order.seller.address}
                  />
                  {seller && (
                    <>
                      <Fact label={t("orders.detail.phone")} value={shownPhone(seller.phone)} />
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-muted-foreground">{t("orders.detail.storeStatus")}</dt>
                        <dd>
                          <StatusBadge status={seller.status} />
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </CardContent>
            </Card>
            <Card size="lg">
              <CardHeader>
                <CardTitle>{t("orders.detail.pickup")}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="flex flex-col gap-2 text-body-sm">
                  <Fact
                    label={t("orders.detail.window")}
                    value={t("orders.detail.windowOn", { window, day: day(order.windowStart) })}
                  />
                  <Fact label={t("orders.detail.place")} value={order.seller.address} />
                  <Fact label={t("orders.detail.payment")} value={t("orders.detail.atCounter")} />
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-end text-body-sm-strong">{value}</dd>
    </div>
  );
}
