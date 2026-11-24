"use client";

import { PackageCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { FailureAlert, type Failure } from "@/components/failure-alert";
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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { collectOrder } from "@/lib/api/generated";

// "Đã nhận món" (customer-confirms-collection increment): within the window the customer confirms they hold the
// food, for a store that did not press "Đã giao", so the order is not counted as a no-show. It is asked once more
// first, as Too Good To Go's "Tap to pick up" opens a sheet before its swipe and Karma asks for "I've picked up"
// only once the food is handed over: one press never ends an order. The question is the registry alert dialog
// (docs/guidelines/web.md › Feedback), whose two buttons a keyboard and a screen reader reach, where a swipe would
// need another way for them (WCAG 2.5.7). The page reads the order again afterwards and shows it collected, with
// its rating. An order placed without signing in is confirmed with its access.
export function CollectOrder({
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
  const t = useTranslations("Orders.collect");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, startTransition] = useTransition();
  const [failed, setFailed] = useState<Failure>();

  const confirm = () =>
    startTransition(async () => {
      setFailed(undefined);
      try {
        await collectOrder({
          path: { orderId },
          headers: access ? { "Order-Access": access } : undefined,
        });
      } catch (error) {
        setFailed(failureOf(error));
        return;
      }
      setOpen(false);
      router.refresh();
    });

  return (
    <section
      aria-labelledby={`collect-order-${orderId}`}
      className="flex flex-col gap-3 rounded-2xl bg-card p-4 text-card-foreground md:flex-row md:items-center md:gap-3 md:px-5 md:py-4.5"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3 md:items-center">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fresh-muted text-success"
        >
          <PackageCheckIcon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col">
          <h2 id={`collect-order-${orderId}`} className="text-title-lg text-foreground">
            {t("question")}
          </h2>
          <p className="text-body-sm text-muted-foreground">{t("hint")}</p>
        </div>
      </div>
      {/* With a phone's large text the label wraps rather than running past the screen (SEC-112). */}
      <Button
        size="lg"
        className="h-auto min-h-13 w-full whitespace-normal md:w-auto"
        onClick={() => {
          setFailed(undefined);
          setOpen(true);
        }}
      >
        {t("open")}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("title", { number })}</AlertDialogTitle>
            <AlertDialogDescription>{t("body", { units, seller })}</AlertDialogDescription>
          </AlertDialogHeader>
          {failed && <FailureAlert failure={failed} fallback={t("failed")} />}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>{t("keep")}</AlertDialogCancel>
            <AlertDialogAction disabled={busy} onClick={confirm}>
              {busy && <Spinner data-icon="inline-start" />}
              {t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
