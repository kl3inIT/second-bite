"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  const shell = useTranslations("admin.shell");
  const [reason, setReason] = useState<CancelReason>();
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);

  async function confirm() {
    if (!onCancel || !canCancel(reason, note)) return;
    setPending(true);
    try {
      await onCancel({ reason, note: note.trim() });
      toast.add({ title: t("done", { code }), type: "success", timeout: 5000 });
      onOpenChange(false);
      setReason(undefined);
      setNote("");
    } catch {
      toast.add({ title: t("failed", { code }), type: "error", timeout: 5000 });
    } finally {
      setPending(false);
    }
  }

  const action = (
    <Button
      variant="destructive"
      disabled={pending || !onCancel || !canCancel(reason, note)}
      onClick={() => void confirm()}
    >
      {pending && <Spinner data-icon="inline-start" />}
      {t("confirm")}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t("title", { code })}</DialogTitle>
        </DialogHeader>
        <CancelOrderFields reason={reason} onReason={setReason} note={note} onNote={setNote} />
        <DialogFooter>
          <DialogClose render={<Button variant="outline" disabled={pending} />}>
            {t("keep")}
          </DialogClose>
          {onCancel ? (
            action
          ) : (
            // A disabled button takes no pointer, so "Sắp có" sits on what holds it.
            <Tooltip>
              <TooltipTrigger render={<span />}>{action}</TooltipTrigger>
              <TooltipContent>{shell("soon")}</TooltipContent>
            </Tooltip>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** The dialog's fields: the reasons as choice cards with a radio (Figma Admin/Radio), then the note. */
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
  const id = useId();

  return (
    <>
      <FieldSet>
        <FieldLegend variant="label">{t("reason")}</FieldLegend>
        <RadioGroup
          name="cancel-reason"
          required
          value={reason ?? null}
          onValueChange={(value) => onReason(value as CancelReason)}
        >
          {cancelReasons.map((each) => (
            <FieldLabel key={each} htmlFor={`${id}-${each}`}>
              <Field orientation="horizontal">
                <RadioGroupItem id={`${id}-${each}`} value={each} />
                <FieldContent>{t(`reasons.${each}`)}</FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </FieldSet>
      <Field>
        <FieldLabel htmlFor={`${id}-note`}>{t("note")}</FieldLabel>
        <Textarea
          id={`${id}-note`}
          value={note}
          maxLength={200}
          required={reason === "other"}
          onChange={(event) => onNote(event.target.value)}
        />
      </Field>
    </>
  );
}
