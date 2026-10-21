"use client";

import { CheckIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

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
import { toast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { formatPrice } from "../../offers/format";
import { isOpen } from "../orders/order";
import { adminHref } from "../pages";
import {
  type AdminTransaction,
  difference,
  eventDots,
  methodLooks,
  transactionStatusLooks,
} from "./payment";

type Fact = { key: string; label: string; value: ReactNode };

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
      toast.add({
        title: t("resolved", { code: transaction.code }),
        type: "success",
        timeout: 5000,
      });
    } catch {
      toast.add({ title: t("failed"), type: "error", timeout: 5000 });
    } finally {
      setPending(false);
    }
  }

  const resolveButton = (
    <Button disabled={!onResolve || pending} onClick={() => void resolve()}>
      <CheckIcon data-icon="inline-start" aria-hidden />
      {t("resolve")}
    </Button>
  );

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" showCloseButton={false}>
        <SheetHeader variant="bar">
          <SheetTitle variant="headline">{t("title", { code: transaction.code })}</SheetTitle>
          <SheetClose
            render={<Button variant="ghost" size="icon" className="ml-auto" />}
            aria-label={shell("sheetClose")}
          >
            <XIcon aria-hidden />
          </SheetClose>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          <TransactionDetails transaction={transaction} />
        </div>
        {transaction.status === "mismatch" && (
          <SheetFooter variant="bar">
            {/* A disabled button takes no pointer, so "Sắp có" sits on what holds it. */}
            <Tooltip>
              <TooltipTrigger render={<span />}>
                <Button variant="outline" disabled>
                  {t("addNote")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{shell("soon")}</TooltipContent>
            </Tooltip>
            {onResolve ? (
              resolveButton
            ) : (
              <Tooltip>
                <TooltipTrigger render={<span />}>{resolveButton}</TooltipTrigger>
                <TooltipContent>{shell("soon")}</TooltipContent>
              </Tooltip>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
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
  const look = transactionStatusLooks[transaction.status];

  const cards: { key: string; title: string; facts: Fact[] }[] = [];
  if (sepay && gap) {
    cards.push({
      key: "sepay",
      title: t("transactions.sheet.sepay"),
      facts: [
        { key: "reference", label: t("transactions.sheet.reference"), value: sepay.reference },
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
      ],
    });
  }
  cards.push({
    key: "order",
    title: t("transactions.sheet.order"),
    facts: [
      {
        key: "order",
        label: t("transactions.sheet.orderCode"),
        value: (
          <Link
            href={adminHref("orderDetail", { orderId: transaction.orderId })}
            className="text-link hover:underline"
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
    ],
  });

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={look.variant}>
          {look.icon && <look.icon aria-hidden />}
          {t(`transactions.status.${transaction.status}`)}
        </Badge>
        <Badge variant={methodLooks[transaction.method].variant}>{methodName}</Badge>
      </div>
      {transaction.status === "mismatch" && (
        <Alert variant="warning">
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>{t("transactions.sheet.mismatch")}</AlertTitle>
        </Alert>
      )}
      {cards.map((card) => (
        <Card key={card.key} size="sm">
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
      <Card size="sm">
        <CardHeader>
          <CardTitle>
            <h2>{t("transactions.sheet.history")}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col">
            {transaction.history.map((event, index) => (
              <li
                key={`${event.kind}-${index}`}
                className="relative flex items-start gap-3 pb-4 last:pb-0"
              >
                {index < transaction.history.length - 1 && (
                  <span aria-hidden className="absolute top-3 bottom-0 left-1 w-px bg-border" />
                )}
                <span
                  aria-hidden
                  className={cn(
                    "relative mt-1.5 size-2.5 shrink-0 rounded-full",
                    eventDots[
                      event.kind === "flaggedMismatch"
                        ? "error"
                        : event.kind === "confirmed"
                          ? "done"
                          : "step"
                    ],
                  )}
                />
                <span className="min-w-0 flex-1 text-body-sm-strong text-foreground">
                  {t(`transactions.sheet.events.${event.kind}`, {
                    order: transaction.orderCode,
                    method: methodName,
                    amount: formatPrice(event.amountVnd ?? transaction.amountVnd),
                  })}
                </span>
                <time dateTime={event.at} className="shrink-0 text-label text-muted-foreground">
                  {format.dateTime(new Date(event.at), "time")},{" "}
                  {format.dateTime(new Date(event.at), "day")}
                </time>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </>
  );
}
