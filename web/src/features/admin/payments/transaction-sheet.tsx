"use client";

import { CheckIcon, TriangleAlertIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { formatPrice } from "../../offers/format";
import { showAdminToast } from "../admin-toast";
import { DetailCard, DetailList } from "../orders/detail-card";
import { isOpen } from "../orders/order";
import { adminHref } from "../pages";
import { SideSheet } from "../ui/side-sheet";
import { Timeline } from "../ui/timeline";
import { type AdminTransaction, difference } from "./payment";
import { MethodBadge, TransactionStatusBadge } from "./payment-badges";

/**
 * A transaction in the side sheet (Figma AD-HT2): its state and method, then SePay's account of a transfer, the
 * order it pays and what happened. A mismatch is said on one line at the top, and the admin can mark it handled
 * through `onResolve` once SEC-18's API exists; until then "Thêm ghi chú" and "Đánh dấu đã xử lý" are locked
 * ("Sắp có").
 */
export function TransactionSheet({
  transaction,
  onClose,
  onResolve,
}: {
  transaction: AdminTransaction;
  onClose: () => void;
  onResolve?: () => Promise<void>;
}) {
  const t = useTranslations("admin.payments.transactions.sheet");
  const shell = useTranslations("admin.shell");
  const [pending, setPending] = useState(false);

  async function resolve() {
    if (!onResolve) return;
    setPending(true);
    try {
      await onResolve();
      showAdminToast(t("resolved", { code: transaction.code }));
    } catch {
      showAdminToast(t("failed"), "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <SideSheet
      open
      onOpenChange={(open) => !open && onClose()}
      title={t("title", { code: transaction.code })}
      footer={
        transaction.status === "mismatch" && (
          <>
            <Button variant="neutral" disabled title={shell("soon")}>
              {t("addNote")}
            </Button>
            <Button
              disabled={!onResolve || pending}
              title={onResolve ? undefined : shell("soon")}
              onClick={() => void resolve()}
            >
              <CheckIcon data-icon="inline-start" aria-hidden />
              {t("resolve")}
            </Button>
          </>
        )
      }
    >
      <TransactionDetails transaction={transaction} />
    </SideSheet>
  );
}

/** The sheet's body, on its own so the tests can read it (a sheet renders in a portal). */
export function TransactionDetails({ transaction }: { transaction: AdminTransaction }) {
  const t = useTranslations("admin.payments");
  const orders = useTranslations("admin.orders");
  const format = useFormatter();

  const methodName = t(`method.${transaction.method}`);
  const sepay = transaction.sepay;
  const gap = sepay && difference(sepay.receivedVnd, transaction.orderAmountVnd);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <TransactionStatusBadge status={transaction.status} />
        <MethodBadge method={transaction.method} />
      </div>
      {transaction.status === "mismatch" && (
        <Alert variant="warning">
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>{t("transactions.sheet.mismatch")}</AlertTitle>
        </Alert>
      )}
      {sepay && gap && (
        <DetailCard size="sheet" title={t("transactions.sheet.sepay")}>
          <DetailList
            facts={[
              {
                key: "reference",
                label: t("transactions.sheet.reference"),
                value: sepay.reference,
              },
              { key: "content", label: t("transactions.sheet.content"), value: sepay.content },
              {
                key: "account",
                label: t("transactions.sheet.account"),
                value: t("transactions.sheet.accountValue", {
                  bank: sepay.bank,
                  last4: sepay.accountLast4,
                }),
              },
              {
                key: "orderAmount",
                label: t("transactions.sheet.orderAmount"),
                value: formatPrice(transaction.orderAmountVnd),
              },
              {
                key: "received",
                label: t("transactions.sheet.received"),
                value: formatPrice(sepay.receivedVnd),
              },
              {
                key: "difference",
                label: t("transactions.sheet.difference"),
                value: (
                  <span className={cn(gap.kind !== "even" && "text-destructive")}>
                    {gap.kind === "even"
                      ? t("transactions.sheet.even")
                      : t(`transactions.sheet.${gap.kind}`, { amount: formatPrice(gap.amountVnd) })}
                  </span>
                ),
              },
            ]}
          />
        </DetailCard>
      )}
      <DetailCard size="sheet" title={t("transactions.sheet.order")}>
        <DetailList
          facts={[
            {
              key: "order",
              label: t("transactions.sheet.orderCode"),
              value: (
                <Link
                  href={adminHref("orderDetail", { orderId: transaction.orderId })}
                  className="rounded-sm text-link hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {t("order", { code: transaction.orderCode })}
                </Link>
              ),
            },
            { key: "seller", label: t("transactions.sheet.seller"), value: transaction.sellerName },
            {
              key: "customer",
              label: t("transactions.sheet.customer"),
              value: t("transactions.sheet.customerValue", {
                name: transaction.customerName,
                phone: transaction.customerPhone,
              }),
            },
            {
              key: "orderStatus",
              label: t("transactions.sheet.orderStatus"),
              value: isOpen(transaction.orderStatus)
                ? t("transactions.sheet.heldUntil", {
                    status: orders(`status.${transaction.orderStatus}`),
                    time: format.dateTime(new Date(transaction.orderPickupEnd), "time"),
                  })
                : orders(`status.${transaction.orderStatus}`),
            },
          ]}
        />
      </DetailCard>
      <DetailCard size="sheet" title={t("transactions.sheet.history")}>
        <Timeline
          events={transaction.history.map((event, index) => ({
            key: `${event.kind}-${index}`,
            title: t(`transactions.sheet.events.${event.kind}`, {
              order: transaction.orderCode,
              method: methodName,
              amount: formatPrice(event.amountVnd ?? transaction.amountVnd),
            }),
            at: event.at,
            tone:
              event.kind === "flaggedMismatch"
                ? "error"
                : event.kind === "confirmed"
                  ? "done"
                  : "step",
          }))}
        />
      </DetailCard>
    </>
  );
}
