"use client";

import { CheckIcon, InfoIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { formatPrice } from "../../offers/format";
import { adminHref } from "../pages";
import {
  type AdminRefund,
  type ApproveRequest,
  eventDots,
  methodLooks,
  type RefundEventKind,
  refundStatusLooks,
} from "./payment";
import { ApproveRefundDialog, RejectRefundDialog } from "./refund-dialogs";

/**
 * A refund request in the side sheet (Figma AD-HT4): its state and method, a line saying the customer paid the
 * store directly, the customer's request with their reason and photos, the store's view and what happened. A
 * waiting request has "Từ chối" and "Duyệt hoàn tiền", each opening its dialog (AD-HT5, AD-HT6).
 */
export function RefundSheet({
  refund,
  onClose,
  onApprove,
  onReject,
}: {
  refund: AdminRefund;
  onClose: () => void;
  onApprove?: (request: ApproveRequest) => Promise<void>;
  onReject?: (reason: string) => Promise<void>;
}) {
  const t = useTranslations("admin.payments.refunds.sheet");
  const shell = useTranslations("admin.shell");
  const [dialog, setDialog] = useState<"approve" | "reject">();

  return (
    <>
      <Sheet open onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" showCloseButton={false}>
          <SheetHeader variant="bar">
            <SheetTitle variant="headline">{t("title", { code: refund.code })}</SheetTitle>
            <SheetClose
              render={<Button variant="ghost" size="icon" className="ml-auto" />}
              aria-label={shell("sheetClose")}
            >
              <XIcon aria-hidden />
            </SheetClose>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
            <RefundDetails refund={refund} />
          </div>
          {refund.status === "pending" && (
            <SheetFooter variant="bar">
              <Button variant="outline" onClick={() => setDialog("reject")}>
                {t("reject")}
              </Button>
              <Button onClick={() => setDialog("approve")}>
                <CheckIcon data-icon="inline-start" aria-hidden />
                {t("approve")}
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
      {refund.status === "pending" && (
        <>
          <ApproveRefundDialog
            code={refund.code}
            askedVnd={refund.amountVnd}
            orderAmountVnd={refund.orderAmountVnd}
            open={dialog === "approve"}
            onOpenChange={(open) => setDialog(open ? "approve" : undefined)}
            onApprove={onApprove}
          />
          <RejectRefundDialog
            code={refund.code}
            open={dialog === "reject"}
            onOpenChange={(open) => setDialog(open ? "reject" : undefined)}
            onReject={onReject}
          />
        </>
      )}
    </>
  );
}

/** The sheet's body, on its own so the tests can read it (a sheet renders in a portal). */
export function RefundDetails({ refund }: { refund: AdminRefund }) {
  const t = useTranslations("admin.payments");
  const format = useFormatter();
  const method = t(`method.${refund.method}`);
  const responded = refund.sellerResponse;
  const look = refundStatusLooks[refund.status];
  const when = (at: string) =>
    `${format.dateTime(new Date(at), "time")}, ${format.dateTime(new Date(at), "day")}`;

  const requestFacts = [
    {
      key: "order",
      label: t("refunds.sheet.order"),
      value: (
        <Link
          href={adminHref("orderDetail", { orderId: refund.orderId })}
          className="text-link hover:underline"
        >
          {t("order", { code: refund.orderCode })}
        </Link>
      ),
    },
    { key: "seller", label: t("refunds.sheet.seller"), value: refund.sellerName },
    {
      key: "payment",
      label: t("refunds.sheet.payment"),
      value:
        refund.transactionCode && refund.transactionStatus
          ? t("refunds.sheet.paymentValue", {
              method,
              transaction: refund.transactionCode,
              status: t(`transactions.status.${refund.transactionStatus}`).toLocaleLowerCase(),
            })
          : method,
    },
    {
      key: "orderAmount",
      label: t("refunds.sheet.orderAmount"),
      value: formatPrice(refund.orderAmountVnd),
    },
    { key: "asked", label: t("refunds.sheet.asked"), value: formatPrice(refund.amountVnd) },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={look.variant}>
          {look.icon && <look.icon aria-hidden />}
          {t(`refunds.status.${refund.status}`)}
        </Badge>
        <Badge variant={methodLooks[refund.method].variant}>{method}</Badge>
      </div>
      <Alert>
        <InfoIcon aria-hidden />
        <AlertTitle>{t("refunds.sheet.paidToSeller")}</AlertTitle>
      </Alert>

      <Card size="sm">
        <CardHeader>
          <CardTitle>
            <h2>{t("refunds.sheet.request")}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <dl className="flex flex-col gap-3">
              {requestFacts.map((fact) => (
                <div key={fact.key} className="flex items-start justify-between gap-3">
                  <dt className="shrink-0 text-body-sm text-muted-foreground">{fact.label}</dt>
                  <dd className="min-w-0 text-right text-body-sm-strong break-words text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-1">
              <h3 className="text-label text-muted-foreground">{t("refunds.sheet.reason")}</h3>
              <blockquote className="text-body-sm text-foreground">
                {t("refunds.sheet.quote", { text: refund.reason })}
              </blockquote>
            </div>
            {refund.photoUrls.length > 0 && (
              <ul aria-label={t("refunds.sheet.photos")} className="flex flex-wrap gap-2">
                {refund.photoUrls.map((url, index) => (
                  <li key={url}>
                    <Image
                      src={url}
                      alt={t("refunds.sheet.photo", { n: index + 1 })}
                      width={88}
                      height={88}
                      unoptimized
                      className="size-22 rounded-sm object-cover"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      {responded && (
        <Card size="sm">
          <CardHeader>
            <CardTitle>
              <h2>{t("refunds.sheet.sellerView")}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <blockquote className="text-body-sm text-foreground">
                {t("refunds.sheet.quote", { text: responded.text })}
              </blockquote>
              <dl className="flex flex-col gap-3">
                {[
                  { key: "by", label: t("refunds.sheet.respondedBy"), value: responded.by },
                  { key: "at", label: t("refunds.sheet.respondedAt"), value: when(responded.at) },
                ].map((fact) => (
                  <div key={fact.key} className="flex items-start justify-between gap-3">
                    <dt className="shrink-0 text-body-sm text-muted-foreground">{fact.label}</dt>
                    <dd className="min-w-0 text-right text-body-sm-strong break-words text-foreground">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </CardContent>
        </Card>
      )}

      <Card size="sm">
        <CardHeader>
          <CardTitle>
            <h2>{t("refunds.sheet.history")}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col">
            {refund.history.map((event, index) => (
              <li
                key={`${event.kind}-${index}`}
                className="relative flex items-start gap-3 pb-4 last:pb-0"
              >
                {index < refund.history.length - 1 && (
                  <span aria-hidden className="absolute top-3 bottom-0 left-1 w-px bg-border" />
                )}
                <span
                  aria-hidden
                  className={cn(
                    "relative mt-1.5 size-2.5 shrink-0 rounded-full",
                    eventDots[
                      event.kind === "rejected"
                        ? "error"
                        : event.kind === "approved"
                          ? "done"
                          : "step"
                    ],
                  )}
                />
                <span className="min-w-0 flex-1 text-body-sm-strong text-foreground">
                  {eventTitle(event, refund, t)}
                </span>
                <time dateTime={event.at} className="shrink-0 text-label text-muted-foreground">
                  {when(event.at)}
                </time>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </>
  );
}

function eventTitle(
  event: AdminRefund["history"][number],
  refund: AdminRefund,
  t: ReturnType<typeof useTranslations<"admin.payments">>,
): string {
  const amount = formatPrice(event.amountVnd ?? refund.orderAmountVnd);
  const kind: RefundEventKind = event.kind;
  switch (kind) {
    case "orderPlaced":
      return t("refunds.sheet.events.orderPlaced", { order: refund.orderCode });
    case "paymentConfirmed":
      return refund.method === "vietqr"
        ? t("refunds.sheet.events.paymentConfirmedVietqr", { amount })
        : t("refunds.sheet.events.paymentConfirmedCash", { amount });
    case "requested":
      return t("refunds.sheet.events.requested", { photos: event.photos ?? 0 });
    case "sellerResponded":
      return t("refunds.sheet.events.sellerResponded");
    case "approved":
      return t("refunds.sheet.events.approved", {
        amount: formatPrice(event.amountVnd ?? refund.amountVnd),
      });
    case "rejected":
      return t("refunds.sheet.events.rejected");
  }
}
