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
import { deliverOrder, refuseOrder, reopenOrder } from "@/lib/api/generated";

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

// The two buttons of an order still held (Figma Q5): "Hủy đơn", which asks for a reason, and "Đã giao", which
// ends the order at once — the customer pays the seller in cash at the counter — and leaves "Hoàn tác" on a
// line at the foot (Q5d) for a tap by mistake.
export function HoldingActions({ orderId, name }: { orderId: string; name: string }) {
  const t = useTranslations("StoreOrders");
  const pathname = usePathname();
  const { pending, failed, run, router } = useOrderAction();
  const [asking, setAsking] = useState(false);

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" disabled={pending} onClick={() => setAsking(true)}>
          {t("cancel")}
        </Button>
        <Button
          type="button"
          disabled={pending}
          onClick={() =>
            run(
              () => deliverOrder({ path: { orderId } }),
              () => {
                const query = Object.fromEntries(new URLSearchParams(window.location.search));
                router.replace({ pathname, query: { ...query, undo: orderId } }, { scroll: false });
              },
            )
          }
        >
          {pending && <Spinner data-icon="inline-start" />}
          {t("deliver")}
        </Button>
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
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancelDialog.back")}
          </Button>
          <Button
            type="button"
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
    <div className="flex flex-col items-end gap-2">
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
