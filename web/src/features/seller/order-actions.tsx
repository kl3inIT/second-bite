"use client";

import { CircleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { usePathname, useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { handOverOrder, markOrderReady, refuseOrder, reopenOrder } from "@/lib/api/generated";

import { cn } from "@/lib/utils";

import { Chip } from "./chip";
import { type CancelReason, cancelReasons } from "./store-orders";

type Failure = { detail?: string; reference?: string };

/** What the seller's buttons share: one request at a time, the list read again after it, and its failure said. */
function useOrderAction() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState<Failure>();

  function run(request: () => Promise<unknown>, after?: () => void) {
    setFailed(undefined);
    startTransition(async () => {
      try {
        await request();
        after?.();
        router.refresh();
      } catch (error) {
        setFailed(failureOf(error));
      }
    });
  }

  return { pending, failed, run, router };
}

function Failed({ failed }: { failed: Failure }) {
  const t = useTranslations("StoreOrders");

  return (
    <Alert variant="destructive">
      <CircleAlertIcon aria-hidden />
      <AlertDescription>
        {failed.detail ?? t("failed")}
        {failed.detail && failed.reference && <> {t("reference", { id: failed.reference })}</>}
      </AlertDescription>
    </Alert>
  );
}

// The two buttons of an order still open (Figma Q5h, Q5i, Q5j, Q5k): "Hủy đơn", which asks for a reason, and
// the next step. While the order is being prepared that is "Báo sẵn sàng", which tells the customer to come
// (SEC-102); once it is ready it is "Đã giao", which ends the order at once — the customer pays the seller in
// cash at the counter — and leaves "Hoàn tác" on a line at the foot (Q5d) for a tap by mistake. From an order's
// own page the list it returns to is `listPath`; from the list it is the page itself.
export function OrderActions({
  orderId,
  name,
  stage,
  listPath,
  fill,
}: {
  orderId: string;
  name: string;
  stage: "preparing" | "ready";
  listPath?: string;
  /** The buttons share the width of their place, as on an order's own page. */
  fill?: boolean;
}) {
  const t = useTranslations("StoreOrders");
  const pathname = usePathname();
  const { pending, failed, run, router } = useOrderAction();
  const [asking, setAsking] = useState(false);

  return (
    <div
      className={cn(
        "relative z-10 flex flex-col items-end gap-2 max-md:w-full max-md:items-stretch",
        fill && "w-full items-stretch",
      )}
    >
      <div className={cn("flex items-center gap-2", fill && "w-full")}>
        <Button
          type="button"
          variant="outline"
          className={cn("max-md:flex-1", fill && "flex-1")}
          disabled={pending}
          onClick={() => setAsking(true)}
        >
          {t("cancel")}
        </Button>
        {stage === "preparing" ? (
          <Button
            type="button"
            className={cn("max-md:flex-1", fill && "flex-1")}
            disabled={pending}
            onClick={() => run(() => markOrderReady({ path: { orderId } }))}
          >
            {pending && <Spinner data-icon="inline-start" />}
            {t("markReady")}
          </Button>
        ) : (
          <Button
            type="button"
            className={cn("max-md:flex-1", fill && "flex-1")}
            disabled={pending}
            onClick={() =>
              run(
                () => handOverOrder({ path: { orderId } }),
                () => {
                  const query = Object.fromEntries(new URLSearchParams(window.location.search));
                  router.replace(
                    { pathname: listPath ?? pathname, query: { ...query, undo: orderId } },
                    { scroll: false },
                  );
                },
              )
            }
          >
            {pending && <Spinner data-icon="inline-start" />}
            {t("deliver")}
          </Button>
        )}
      </div>
      {failed && <Failed failed={failed} />}
      <CancelDialog open={asking} onOpenChange={setAsking} orderId={orderId} name={name} />
    </div>
  );
}

// "Hủy đơn" (Figma Q5c): the reason is chosen from the few the pilot's counter meets, and "another reason" asks
// for the words. Customers who did not come give their portions back; the server does that.
function CancelDialog({
  open,
  onOpenChange,
  orderId,
  name,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  name: string;
}) {
  const t = useTranslations("StoreOrders");
  const [reason, setReason] = useState<CancelReason>("no_answer");
  const [note, setNote] = useState("");
  const { pending, failed, run } = useOrderAction();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t("cancelDialog.title", { name })}</DialogTitle>
          <DialogDescription>{t("cancelDialog.body")}</DialogDescription>
        </DialogHeader>
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">{t("reasonLabel")}</legend>
          <div className="-my-1 flex flex-wrap gap-x-2">
            {cancelReasons.map((value) => (
              <Chip key={value} selected={reason === value} onClick={() => setReason(value)}>
                {t(`reason.${value}`)}
              </Chip>
            ))}
          </div>
          {reason === "other" && (
            <Input
              aria-label={t("cancelDialog.note")}
              placeholder={t("cancelDialog.note")}
              value={note}
              maxLength={200}
              onChange={(event) => setNote(event.target.value)}
            />
          )}
        </fieldset>
        {failed && <Failed failed={failed} />}
        <DialogFooter className="max-sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="max-sm:flex-1"
            onClick={() => onOpenChange(false)}
          >
            {t("cancelDialog.back")}
          </Button>
          <Button
            type="button"
            className="max-sm:flex-1"
            disabled={pending}
            onClick={() =>
              run(
                () =>
                  refuseOrder({
                    path: { orderId },
                    body: {
                      reason,
                      ...(reason === "other" && note.trim() ? { note: note.trim() } : {}),
                    },
                  }),
                () => onOpenChange(false),
              )
            }
          >
            {pending && <Spinner data-icon="inline-start" />}
            {t("cancelDialog.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// "Hoàn tác" on an order handed over, or one the seller cancelled (Figma Q5e, Q5f): it is held again, and its
// portions are taken again when the cancelling had given them back.
export function ReopenButton({ orderId }: { orderId: string }) {
  const t = useTranslations("StoreOrders");
  const { pending, failed, run } = useOrderAction();

  return (
    <div className="relative z-10 flex flex-col items-end gap-2 max-md:w-full max-md:items-stretch">
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={() => run(() => reopenOrder({ path: { orderId } }))}
      >
        {pending && <Spinner data-icon="inline-start" />}
        {t("reopen")}
      </Button>
      {failed && <Failed failed={failed} />}
    </div>
  );
}
