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

const reasons = ["late", "mistake", "other"] as const;

// Cancelling an order from the line under it (Figma D2 › huỷ đơn), asked once more first (Figma W2b): its
// units go back to the seller, nothing was paid, and a reason may be chosen. The page reads the order again
// afterwards and shows it cancelled. An order placed without signing in is cancelled with its access (SEC-76 ›
// decision 7).
export function CancelOrder({
  orderId,
  access,
  number,
  seller,
  units,
}: {
  orderId: string;
  access?: string;
  number: string;
  seller: string;
  units: number;
  /** When the window opens, until which cancelling is free. */
}) {
  const t = useTranslations("Orders.cancel");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<(typeof reasons)[number]>();
  const [failure, setFailure] = useState<{ tooLate: boolean; reference?: string }>();
  const [pending, startTransition] = useTransition();

  function cancel() {
    setFailure(undefined);
    startTransition(async () => {
      try {
        await cancelOrder({
          path: { orderId },
          headers: access ? { "Order-Access": access } : undefined,
          body: reason ? { reason: t(`reasons.${reason}`) } : {},
        });
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
      {/* With a phone's large text the note goes under "Huỷ đơn" rather than past the screen (SEC-112). */}
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="lg"
            className="h-auto min-h-13 max-w-full flex-wrap whitespace-normal"
          />
        }
      >
        <CircleXIcon aria-hidden className="text-destructive" />
        <span className="text-destructive">{t("open")}</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title", { number })}</AlertDialogTitle>
          <AlertDialogDescription>{t("body", { units, seller })}</AlertDialogDescription>
        </AlertDialogHeader>
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">{t("reason")}</legend>
          {reasons.map((key) => (
            <Button
              key={key}
              variant={reason === key ? "secondary" : "outline"}
              aria-pressed={reason === key}
              onClick={() => setReason(reason === key ? undefined : key)}
            >
              {t(`reasons.${key}`)}
            </Button>
          ))}
        </fieldset>
        {failure ? (
          <p role="alert" className="text-body-sm text-destructive">
            {failure.tooLate ? t("tooLate") : t("failed", { reference: failure.reference ?? "—" })}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel variant="ghost" size="lg">
            {t("keep")}
          </AlertDialogCancel>
          <Button size="lg" disabled={pending} onClick={cancel}>
            {pending ? <Spinner data-icon="inline-start" /> : null}
            {t("confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
