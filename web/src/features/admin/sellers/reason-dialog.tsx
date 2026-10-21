"use client";

import {
  BanIcon,
  CheckIcon,
  CircleXIcon,
  EyeIcon,
  InfoIcon,
  type LucideIcon,
  RotateCcwIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { isReason, REASON_MAX, REASON_MIN } from "./review";

export type ReasonKind = "reject" | "block";

/**
 * Rejecting or blocking a store with its reason (Figma AD-DS3, AD-DS4): a dialog holding a form, the reason
 * first, which the owner reads in their email, then what follows. The action waits for a reason of 10 to 500
 * characters; while it is out, the dialog cannot be closed and the action shows its spinner.
 */
export function ReasonDialog({
  kind,
  name,
  open,
  onOpenChange,
  reason,
  onReason,
  pending,
  onConfirm,
}: {
  kind: ReasonKind;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: string;
  onReason: (reason: string) => void;
  pending: boolean;
  onConfirm: () => void;
}) {
  const t = useTranslations("admin.sellers.actions");
  const cancel = useTranslations("admin.shell.confirm")("cancel");
  const formId = useId();

  const confirm: { label: string; icon: LucideIcon } =
    kind === "reject"
      ? { label: t("reject"), icon: CircleXIcon }
      : { label: t("block"), icon: BanIcon };
  const Icon = confirm.icon;

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {kind === "reject" ? t("rejectConfirm.title", { name }) : t("confirm.title", { name })}
          </DialogTitle>
        </DialogHeader>
        <form
          id={formId}
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (isReason(reason) && !pending) onConfirm();
          }}
        >
          <ReasonBody kind={kind} reason={reason} onReason={onReason} />
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} disabled={pending}>
            {cancel}
          </DialogClose>
          <Button
            type="submit"
            form={formId}
            variant="destructive"
            disabled={pending || !isReason(reason)}
          >
            {pending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Icon data-icon="inline-start" aria-hidden />
            )}
            {confirm.label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** The dialog's body: the reason's field, then what follows the action, as Figma orders them. */
export function ReasonBody({
  kind,
  reason,
  onReason,
}: {
  kind: ReasonKind;
  reason: string;
  onReason: (reason: string) => void;
}) {
  const t = useTranslations("admin.sellers.actions");
  const id = useId();
  const reject = kind === "reject";
  const consequences: { icon: LucideIcon; text: string }[] = reject
    ? [
        { icon: BanIcon, text: t("rejectConfirm.hidden") },
        { icon: InfoIcon, text: t("rejectConfirm.emailed") },
        { icon: CheckIcon, text: t("rejectConfirm.retry") },
      ]
    : [
        { icon: BanIcon, text: t("confirm.noPosting") },
        { icon: EyeIcon, text: t("confirm.hidden") },
        { icon: CheckIcon, text: t("confirm.kept") },
        { icon: InfoIcon, text: t("confirm.emailed") },
      ];

  return (
    <>
      <Field>
        <FieldLabel htmlFor={id}>
          {reject ? t("rejectConfirm.reason") : t("confirm.reason")}
        </FieldLabel>
        <Textarea
          id={id}
          rows={3}
          required
          minLength={REASON_MIN}
          maxLength={REASON_MAX}
          value={reason}
          onChange={(event) => onReason(event.target.value)}
        />
      </Field>
      <div className="flex flex-col gap-2">
        <p className="text-label-strong text-foreground">
          {reject ? t("rejectConfirm.when") : t("confirm.when")}
        </p>
        <ul className="flex flex-col gap-2">
          {consequences.map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-2 text-body-sm text-foreground">
              <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
      {!reject && (
        <p className="flex items-center gap-2 text-body-sm text-muted-foreground">
          <RotateCcwIcon aria-hidden className="size-4 shrink-0" />
          {t("confirm.undo")}
        </p>
      )}
    </>
  );
}
