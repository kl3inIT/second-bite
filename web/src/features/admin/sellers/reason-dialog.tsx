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

import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog, ConsequenceList } from "@/features/admin/ui/confirm-dialog";

import { isReason, REASON_MAX } from "./review";

export type ReasonKind = "reject" | "block";

/**
 * Rejecting or blocking a store with its reason (Figma AD-DS3, AD-DS4), behind the `storeReview` flag (SEC-64):
 * the reason first, which the owner reads in their email, then what follows. The action waits for a reason, and
 * stays off with "Sắp có" while the backend takes none (`ready`).
 */
export function ReasonDialog({
  kind,
  name,
  open,
  onOpenChange,
  reason,
  onReason,
  ready,
  pending,
  onConfirm,
}: {
  kind: ReasonKind;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: string;
  onReason: (reason: string) => void;
  ready: boolean;
  pending: boolean;
  onConfirm: () => void;
}) {
  const t = useTranslations("admin.sellers.actions");
  const soon = useTranslations("admin.shell")("soon");
  const confirm: { label: string; icon: LucideIcon } =
    kind === "reject"
      ? { label: t("reject"), icon: CircleXIcon }
      : { label: t("block"), icon: BanIcon };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={kind === "reject" ? t("rejectConfirm.title", { name }) : t("confirm.title", { name })}
      confirmLabel={confirm.label}
      confirmIcon={confirm.icon}
      destructive
      pending={pending}
      confirmDisabled={!ready || !isReason(reason)}
      confirmTitle={ready ? undefined : soon}
      onConfirm={onConfirm}
      form={<ReasonBody kind={kind} reason={reason} onReason={onReason} />}
    />
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

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-label-strong text-foreground">
          {kind === "reject" ? t("rejectConfirm.reason") : t("confirm.reason")}
        </label>
        <Textarea
          id={id}
          rows={3}
          required
          maxLength={REASON_MAX}
          value={reason}
          onChange={(event) => onReason(event.target.value)}
        />
      </div>
      {kind === "reject" ? (
        <ConsequenceList
          title={t("rejectConfirm.when")}
          items={[
            { icon: BanIcon, text: t("rejectConfirm.hidden") },
            { icon: InfoIcon, text: t("rejectConfirm.emailed") },
            { icon: CheckIcon, text: t("rejectConfirm.retry") },
          ]}
        />
      ) : (
        <>
          <ConsequenceList
            title={t("confirm.when")}
            items={[
              { icon: BanIcon, text: t("confirm.noPosting") },
              { icon: EyeIcon, text: t("confirm.hidden") },
              { icon: CheckIcon, text: t("confirm.kept") },
              { icon: InfoIcon, text: t("confirm.emailed") },
            ]}
          />
          <p className="flex items-center gap-2 text-body-sm text-muted-foreground">
            <RotateCcwIcon aria-hidden className="size-4 shrink-0" />
            {t("confirm.undo")}
          </p>
        </>
      )}
    </>
  );
}
