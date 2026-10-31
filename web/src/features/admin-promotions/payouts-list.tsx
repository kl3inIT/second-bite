"use client";

import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { useState, useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { DataTable, type DataTableColumns } from "@/features/admin/data-table";
import { formatPrice } from "@/features/offers/format";
import { useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { markPayoutPaid, type PayoutBody } from "@/lib/api/generated";

import { payoutSearchParams } from "./search-params";
import { shiftDay } from "./week";

const anyPromotion = "all";

/**
 * What Second Bite pays each store back for a week (buyer-discount increment): the discounts of its orders handed
 * over from Monday to Sunday, Vietnam time, and whether an admin has marked the transfer made. The week moves by
 * its arrows; a promotion narrows it. Marking is the record of a transfer made outside the app, not the transfer.
 */
export function PayoutsList({
  payouts,
  week,
  promotions,
}: {
  payouts: PayoutBody[];
  week: string;
  promotions: Array<{ id: string; name: string }>;
}) {
  const t = useTranslations("Admin.payouts");
  const format = useFormatter();
  const [pending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(payoutSearchParams, {
    shallow: false,
    startTransition,
  });
  const [marking, setMarking] = useState<PayoutBody | null>(null);
  const columns = useColumns(setMarking);

  const day = (d: string) => format.dateTime(new Date(`${d}T00:00:00+07:00`), "dayMonth");
  const owed = payouts.filter((p) => !p.paidAt).reduce((sum, p) => sum + p.amountVnd, 0);
  const total = payouts.reduce((sum, p) => sum + p.amountVnd, 0);

  return (
    <section aria-label={t("title")} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("previous")}
            onClick={() => void setParams({ week: shiftDay(week, -7) })}
          >
            <ChevronLeftIcon aria-hidden />
          </Button>
          <span
            className="min-w-36 text-center text-body-sm-strong text-foreground"
            aria-live="polite"
          >
            {t("week", { from: day(week), until: day(shiftDay(week, 6)) })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("next")}
            onClick={() => void setParams({ week: shiftDay(week, 7) })}
          >
            <ChevronRightIcon aria-hidden />
          </Button>
        </div>
        <Select
          value={params.promotion ?? anyPromotion}
          items={[
            { value: anyPromotion, label: t("anyPromotion") },
            ...promotions.map((p) => ({ value: p.id, label: p.name })),
          ]}
          onValueChange={(promotion) =>
            void setParams({ promotion: promotion === anyPromotion ? null : promotion })
          }
        >
          <SelectTrigger size="lg" aria-label={t("promotion")}>
            <span className="text-muted-foreground">{t("promotion")}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={anyPromotion}>{t("anyPromotion")}</SelectItem>
              {promotions.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="ms-auto flex flex-col items-end">
          <span className="font-display text-price-lg text-foreground">{formatPrice(owed)}</span>
          <span className="text-label text-muted-foreground">
            {t("owed", { total: formatPrice(total) })}
          </span>
        </p>
      </div>
      <p className="text-body-sm text-muted-foreground">{t("hint")}</p>
      <DataTable
        label={t("title")}
        columns={columns}
        rows={payouts}
        rowKey={(payout) => payout.sellerId}
        busy={pending}
        empty={
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{t("empty")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        }
      />
      <MarkDialog
        payout={marking}
        week={week}
        weekLabel={t("week", { from: day(week), until: day(shiftDay(week, 6)) })}
        onOpenChange={(open) => {
          if (!open) setMarking(null);
        }}
      />
    </section>
  );
}

function useColumns(onMark: (payout: PayoutBody) => void): DataTableColumns<PayoutBody> {
  const t = useTranslations("Admin.payouts");
  const format = useFormatter();

  return [
    {
      id: "store",
      header: t("column.store"),
      meta: { width: "w-56" },
      cell: ({ row }) => (
        <span className="text-body-sm-strong text-foreground">{row.original.sellerName}</span>
      ),
    },
    {
      id: "orders",
      header: t("column.orders"),
      meta: { width: "w-28" },
      cell: ({ row }) =>
        t("orders", { count: row.original.orders, fresh: row.original.newCustomers }),
    },
    {
      id: "amount",
      header: t("column.amount"),
      meta: { width: "w-32" },
      cell: ({ row }) => (
        <span className="font-display text-foreground">{formatPrice(row.original.amountVnd)}</span>
      ),
    },
    {
      id: "status",
      header: t("column.status"),
      meta: { width: "w-48" },
      cell: ({ row }) => {
        const { paidAt, paidVnd, amountVnd } = row.original;
        if (!paidAt) return <Badge variant="warning">{t("unpaid")}</Badge>;
        return (
          <div className="flex flex-col gap-1">
            <Badge variant="success">
              <CheckIcon data-icon="inline-start" aria-hidden />
              {t("paid", { day: format.dateTime(new Date(paidAt), "dayMonth") })}
            </Badge>
            {paidVnd !== undefined && paidVnd < amountVnd && (
              <span className="text-label text-muted-foreground">
                {t("more", { amount: formatPrice(amountVnd - paidVnd) })}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">{t("column.actions")}</span>,
      meta: { width: "w-40" },
      cell: ({ row }) =>
        !row.original.paidAt && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onMark(row.original)}>
              {t("mark")}
            </Button>
          </div>
        ),
    },
  ];
}

function MarkDialog({
  payout,
  week,
  weekLabel,
  onOpenChange,
}: {
  payout: PayoutBody | null;
  week: string;
  weekLabel: string;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Admin.payouts");
  const router = useRouter();
  const [busy, startTransition] = useTransition();
  // The last payout stays drawn while the dialog closes.
  const [shown, setShown] = useState(payout);
  if (payout && payout !== shown) setShown(payout);

  const run = () =>
    startTransition(async () => {
      if (!payout) return;
      try {
        await markPayoutPaid({ path: { sellerId: payout.sellerId, weekStart: week } });
        toast.add({ type: "success", title: t("marked", { name: payout.sellerName }) });
      } catch (error) {
        const { detail, reference } = failureOf(error);
        toast.add({
          type: "error",
          title: [detail ?? t("failed"), reference && `(${reference})`].filter(Boolean).join(" "),
        });
      }
      router.refresh();
      onOpenChange(false);
    });

  return (
    <AlertDialog open={payout !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("confirm.title", {
              amount: formatPrice(shown?.amountVnd ?? 0),
              name: shown?.sellerName ?? "",
            })}
          </AlertDialogTitle>
          <AlertDialogDescription>{t("confirm.body", { week: weekLabel })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("confirm.cancel")}</AlertDialogCancel>
          <AlertDialogAction disabled={busy} onClick={run}>
            {busy && <Spinner data-icon="inline-start" />}
            {t("confirm.action")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
