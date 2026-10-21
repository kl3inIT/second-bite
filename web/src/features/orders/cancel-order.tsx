"use client";

import { CircleXIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { cancelOrder } from "@/lib/api/generated";

const reasons = ["late", "mistake", "other"] as const;

// A reason's chip (Figma D2c): white on a pale blue edge, Tasco blue words; the chosen one filled. The 44px target
// is the invisible area around it.
const CHIP =
  "relative h-8 rounded-full border border-secondary bg-card px-3.5 text-note font-medium text-primary after:absolute after:inset-x-0 after:-inset-y-1.5 aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none";

// Cancelling an order from its page (Figma D2b, D4), asked once more first, in a sheet from the foot on a phone (Figma
// D2c) and a dialog on a wider screen (Figma W2b): its units go back to the seller, nothing was paid, and a reason
// may be chosen. The page reads the order again afterwards and shows it cancelled. An order placed without signing in
// is cancelled with its access (SEC-76 › decision 7).
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
}) {
  const t = useTranslations("Orders.cancel");
  const router = useRouter();
  const phone = useIsMobile();
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

  const form = (
    <>
      <fieldset className="flex min-w-0 flex-col gap-2">
        <legend className="mb-2 text-note font-semibold text-muted-foreground">
          {t("reason")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {reasons.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={reason === key}
              onClick={() => setReason(reason === key ? undefined : key)}
              className={CHIP}
            >
              {t(`reasons.${key}`)}
            </button>
          ))}
        </div>
      </fieldset>
      {failure ? (
        <p role="alert" className="text-body-sm text-destructive">
          {failure.tooLate ? t("tooLate") : t("failed", { reference: failure.reference ?? "—" })}
        </p>
      ) : null}
      {/* A phone stacks the two; from 768px they sit side by side, "Giữ đơn" first (Figma W2b). */}
      <div className="flex flex-col gap-2 pt-1.5 md:grid md:grid-cols-2 md:gap-3 md:pt-0">
        <Button variant="danger" size="lg" disabled={pending} onClick={cancel}>
          {pending ? <Spinner data-icon="inline-start" /> : null}
          {t("confirm")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="md:order-first"
          onClick={() => setOpen(false)}
        >
          {t("keep")}
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col gap-2 pt-2 pb-6 md:flex-row md:items-center md:gap-3 md:rounded-2xl md:bg-card md:px-5 md:py-4.5 md:pb-4.5">
      {/* Figma D4: from 768px the button sits at the end of a card that asks "Đổi ý?". */}
      <span
        aria-hidden
        className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-destructive-muted text-destructive md:flex"
      >
        <CircleXIcon className="size-5" />
      </span>
      <div className="hidden min-w-0 flex-1 flex-col md:flex">
        <p className="text-title-lg text-foreground">{t("change")}</p>
        <p className="text-body-sm text-muted-foreground">{t("after")}</p>
      </div>
      {/* With a phone's large text the label wraps rather than running past the screen (SEC-112). */}
      <Button
        variant="cancel"
        size="lg"
        className="h-auto min-h-13 w-full whitespace-normal md:w-auto"
        onClick={() => setOpen(true)}
      >
        {t("open")}
      </Button>
      {phone ? (
        <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
          <DrawerContent>
            <div className="mx-auto flex w-full max-w-xl flex-col gap-3.5 px-5 pt-2.5 pb-8.5">
              <DrawerTitle>{t("title", { number })}</DrawerTitle>
              <DrawerDescription>{t("body", { units, seller })}</DrawerDescription>
              {form}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent showCloseButton={false} className="sm:max-w-120">
            <DialogTitle size="headline">{t("title", { number })}</DialogTitle>
            <DialogDescription>{t("body", { units, seller })}</DialogDescription>
            {form}
          </DialogContent>
        </Dialog>
      )}
      <p className="text-center text-label text-muted-foreground md:hidden">{t("note")}</p>
    </div>
  );
}
