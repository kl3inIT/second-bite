"use client";

import { CircleXIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { cancelOrder } from "@/lib/api/generated";

// Cancelling an order, asked once more first (Figma W2b): free of charge until the window opens, and its
// units go back on sale. The page reads the order again afterwards and shows it cancelled (W4).
export function CancelOrder({ orderId, freeUntil }: { orderId: string; freeUntil: string }) {
  const t = useTranslations("Orders.cancel");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [failure, setFailure] = useState<{ tooLate: boolean; reference?: string }>();
  const [pending, startTransition] = useTransition();

  function cancel() {
    setFailure(undefined);
    startTransition(async () => {
      try {
        await cancelOrder({ path: { orderId }, body: {} });
        setOpen(false);
        router.refresh();
      } catch (error) {
        const apiError = error instanceof ApiError ? error : undefined;
        setFailure({
          tooLate: apiError?.code === "ORDER_CANCEL_TOO_LATE",
          reference: apiError?.requestId,
        });
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="outline" size="lg" />}>
        <CircleXIcon data-icon="inline-start" />
        {t("open")}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("body", { until: freeUntil })}</AlertDialogDescription>
        </AlertDialogHeader>
        {failure ? (
          <p role="alert" className="text-body-sm text-destructive">
            {failure.tooLate ? t("tooLate") : t("failed", { reference: failure.reference ?? "—" })}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel size="lg">{t("keep")}</AlertDialogCancel>
          <Button variant="destructive" size="lg" disabled={pending} onClick={cancel}>
            {pending ? <Spinner data-icon="inline-start" /> : null}
            {t("confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
