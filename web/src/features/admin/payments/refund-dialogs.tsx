"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Textarea } from "@/components/ui/textarea";

import { showAdminToast } from "../lib/toast";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { NumberField } from "../ui/number-field";
import { SegmentedControl } from "../ui/segmented-control";
import { type ApproveRequest, canApprove, canReject, type RefundWay } from "./payment";

/**
 * "Duyệt hoàn tiền cho HT-0312?" (Figma AD-HT5): how much the store gives back, at most the order's amount; how
 * (at the counter or by transfer); and a note for the customer. It sends through `onApprove` once SEC-18's API
 * exists; until then the action is locked ("Sắp có").
 */
export function ApproveRefundDialog({
  code,
  askedVnd,
  orderAmountVnd,
  open,
  onOpenChange,
  onApprove,
}: {
  code: string;
  askedVnd: number;
  orderAmountVnd: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (request: ApproveRequest) => Promise<void>;
}) {
  const t = useTranslations("admin.payments.refunds.approve");
  const shell = useTranslations("admin.shell");
  const [request, setRequest] = useState<ApproveRequest>({
    amountVnd: Math.min(askedVnd, orderAmountVnd),
    way: "atCounter",
    note: "",
  });
  const [pending, setPending] = useState(false);
  const ready = canApprove(request.amountVnd, orderAmountVnd);

  async function confirm() {
    if (!onApprove || !ready) return;
    setPending(true);
    try {
      await onApprove({ ...request, note: request.note.trim() });
      showAdminToast(t("done", { code }));
      onOpenChange(false);
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
      cancelLabel={t("cancel")}
      confirmLabel={t("confirm")}
      confirmDisabled={!onApprove || !ready}
      confirmTitle={onApprove ? undefined : shell("soon")}
      pending={pending}
      onConfirm={() => void confirm()}
      form={
        <ApproveRefundFields
          request={request}
          orderAmountVnd={orderAmountVnd}
          onChange={(next) => setRequest({ ...request, ...next })}
        />
      }
    />
  );
}

/** The approval's fields: the amount in đồng, kept within 1đ and the order's amount, the way, the note. */
export function ApproveRefundFields({
  request,
  orderAmountVnd,
  onChange,
}: {
  request: ApproveRequest;
  orderAmountVnd: number;
  onChange: (next: Partial<ApproveRequest>) => void;
}) {
  const t = useTranslations("admin.payments.refunds.approve");
  const amountId = useId();
  const noteId = useId();

  return (
    <>
      <NumberField
        id={amountId}
        label={t("amount")}
        value={request.amountVnd}
        min={1}
        max={orderAmountVnd}
        unit="đ"
        onChange={(amountVnd) => onChange({ amountVnd })}
      />
      <div className="flex flex-col gap-1.5">
        <span aria-hidden className="text-label-strong text-foreground">
          {t("way")}
        </span>
        <SegmentedControl<RefundWay>
          label={t("way")}
          value={request.way}
          segments={[
            { value: "atCounter", label: t("ways.atCounter") },
            { value: "transfer", label: t("ways.transfer") },
          ]}
          onChange={(way) => onChange({ way })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={noteId} className="text-label-strong text-foreground">
          {t("note")}
        </label>
        <Textarea
          id={noteId}
          value={request.note}
          maxLength={300}
          onChange={(event) => onChange({ note: event.target.value })}
          className="min-h-24"
        />
      </div>
    </>
  );
}

/**
 * "Từ chối yêu cầu HT-0312?" (Figma AD-HT6): the reason is required, and the customer reads it. It sends through
 * `onReject` once SEC-18's API exists; until then the action is locked ("Sắp có").
 */
export function RejectRefundDialog({
  code,
  open,
  onOpenChange,
  onReject,
}: {
  code: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject?: (reason: string) => Promise<void>;
}) {
  const t = useTranslations("admin.payments.refunds.reject");
  const shell = useTranslations("admin.shell");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);

  async function confirm() {
    if (!onReject || !canReject(reason)) return;
    setPending(true);
    try {
      await onReject(reason.trim());
      showAdminToast(t("done", { code }));
      onOpenChange(false);
      setReason("");
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
      cancelLabel={t("cancel")}
      confirmLabel={t("confirm")}
      destructive
      confirmDisabled={!onReject || !canReject(reason)}
      confirmTitle={onReject ? undefined : shell("soon")}
      pending={pending}
      onConfirm={() => void confirm()}
      form={<RejectRefundFields reason={reason} onReason={setReason} />}
    />
  );
}

/** The refusal's one field: why, which the customer reads. */
export function RejectRefundFields({
  reason,
  onReason,
}: {
  reason: string;
  onReason: (reason: string) => void;
}) {
  const t = useTranslations("admin.payments.refunds.reject");
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label-strong text-foreground">
        {t("reason")}
      </label>
      <Textarea
        id={id}
        value={reason}
        required
        maxLength={300}
        onChange={(event) => onReason(event.target.value)}
        className="min-h-24"
      />
    </div>
  );
}
