"use client";

import { CheckIcon, InfoIcon } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

import { formatPrice } from "../../offers/format";
import { DetailCard, DetailList } from "../orders/detail-card";
import { adminHref } from "../pages";
import { SideSheet } from "../ui/side-sheet";
import { Timeline } from "../ui/timeline";
import type { AdminRefund, ApproveRequest, RefundEventKind } from "./payment";
import { MethodBadge, RefundStatusBadge } from "./payment-badges";
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
  const [dialog, setDialog] = useState<"approve" | "reject">();

  return (
    <>
      <SideSheet
        open
        onOpenChange={(open) => !open && onClose()}
        title={t("title", { code: refund.code })}
        footer={
          refund.status === "pending" && (
            <>
              <Button variant="neutral" onClick={() => setDialog("reject")}>
                {t("reject")}
              </Button>
              <Button onClick={() => setDialog("approve")}>
                <CheckIcon data-icon="inline-start" aria-hidden />
                {t("approve")}
              </Button>
            </>
          )
        }
      >
        <RefundDetails refund={refund} />
      </SideSheet>
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

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <RefundStatusBadge status={refund.status} />
        <MethodBadge method={refund.method} />
      </div>
      <Alert variant="info">
        <InfoIcon aria-hidden />
        <AlertTitle>{t("refunds.sheet.paidToSeller")}</AlertTitle>
      </Alert>

      <DetailCard size="sheet" title={t("refunds.sheet.request")}>
        <DetailList
          facts={[
            {
              key: "order",
              label: t("refunds.sheet.order"),
              value: (
                <Link
                  href={adminHref("orderDetail", { orderId: refund.orderId })}
                  className="rounded-sm text-link hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
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
                      status: t(
                        `transactions.status.${refund.transactionStatus}`,
                      ).toLocaleLowerCase(),
                    })
                  : method,
            },
            {
              key: "orderAmount",
              label: t("refunds.sheet.orderAmount"),
              value: formatPrice(refund.orderAmountVnd),
            },
            {
              key: "asked",
              label: t("refunds.sheet.asked"),
              value: formatPrice(refund.amountVnd),
            },
          ]}
        />
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
      </DetailCard>

      {responded && (
        <DetailCard size="sheet" title={t("refunds.sheet.sellerView")}>
          <blockquote className="text-body-sm text-foreground">
            {t("refunds.sheet.quote", { text: responded.text })}
          </blockquote>
          <DetailList
            facts={[
              { key: "by", label: t("refunds.sheet.respondedBy"), value: responded.by },
              {
                key: "at",
                label: t("refunds.sheet.respondedAt"),
                value: `${format.dateTime(new Date(responded.at), "time")}, ${format.dateTime(new Date(responded.at), "day")}`,
              },
            ]}
          />
        </DetailCard>
      )}

      <DetailCard size="sheet" title={t("refunds.sheet.history")}>
        <Timeline
          events={refund.history.map((event, index) => ({
            key: `${event.kind}-${index}`,
            title: eventTitle(event, refund, t),
            at: event.at,
            tone: event.kind === "rejected" ? "error" : event.kind === "approved" ? "done" : "step",
          }))}
        />
      </DetailCard>
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
