"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { showAdminToast } from "../admin-toast";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { type CancelReason, type CancelRequest, canCancel, cancelReasons } from "./order";

/**
 * "Huỷ đơn #SB-24817?" (Figma AD-DH4): a reason is required, picked from three; "Lý do khác" needs the note,
 * which goes to the customer and the store. The order is cancelled by `onCancel`, which SEC-15's admin API
 * will back; until then none is passed and the action stays locked ("Sắp có"), so nothing pretends to work.
 */
export function CancelOrderDialog({
  code,
  open,
  onOpenChange,
  onCancel,
}: {
  code: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: (request: CancelRequest) => Promise<void>;
}) {
  const t = useTranslations("admin.orders.cancel");
  const [reason, setReason] = useState<CancelReason>();
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);

  async function confirm() {
    if (!onCancel || !canCancel(reason, note)) return;
    setPending(true);
    try {
      await onCancel({ reason, note: note.trim() });
      showAdminToast(t("done", { code }));
      onOpenChange(false);
      setReason(undefined);
      setNote("");
    } catch {
      showAdminToast(t("failed", { code }), "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title", { code })}
      cancelLabel={t("keep")}
      confirmLabel={t("confirm")}
      destructive
      confirmDisabled={!onCancel || !canCancel(reason, note)}
      pending={pending}
      onConfirm={() => void confirm()}
      form={<CancelOrderFields reason={reason} onReason={setReason} note={note} onNote={setNote} />}
    />
  );
}

/** The dialog's fields: the reasons as cards with a radio (Figma Admin/Radio), then the note. */
export function CancelOrderFields({
  reason,
  onReason,
  note,
  onNote,
}: {
  reason: CancelReason | undefined;
  onReason: (reason: CancelReason) => void;
  note: string;
  onNote: (note: string) => void;
}) {
  const t = useTranslations("admin.orders.cancel");
  const noteId = useId();

  return (
    <>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-label-strong text-foreground">{t("reason")}</legend>
        {cancelReasons.map((each) => (
          <label
            key={each}
            className={cn(
              "flex min-h-12.5 cursor-pointer items-center gap-2.5 rounded-md border bg-card px-4 text-body-sm text-foreground transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
              each === reason ? "border-2 border-primary bg-muted px-3.75" : "border-border",
            )}
          >
            <input
              type="radio"
              name="cancel-reason"
              value={each}
              checked={each === reason}
              required
              onChange={() => onReason(each)}
              className="size-5 shrink-0 accent-primary"
            />
            {t(`reasons.${each}`)}
          </label>
        ))}
      </fieldset>
      <div className="flex flex-col gap-2">
        <label htmlFor={noteId} className="text-label-strong text-foreground">
          {t("note")}
        </label>
        <Textarea
          id={noteId}
          value={note}
          maxLength={200}
          required={reason === "other"}
          onChange={(event) => onNote(event.target.value)}
          className="min-h-30"
        />
      </div>
    </>
  );
}
