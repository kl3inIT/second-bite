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
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { type ApproveRequest, canApprove, canReject, type RefundWay } from "./payment";

const refundWays: readonly RefundWay[] = ["atCounter", "transfer"];

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
      toast.add({ title: t("done", { code }), type: "success", timeout: 5000 });
      onOpenChange(false);
    } catch {
      toast.add({ title: t("failed", { code }), type: "error", timeout: 5000 });
    } finally {
      setPending(false);
    }
  }

  const action = (
    <Button disabled={pending || !onApprove || !ready} onClick={() => void confirm()}>
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
        <ApproveRefundFields
          request={request}
          orderAmountVnd={orderAmountVnd}
          onChange={(next) => setRequest({ ...request, ...next })}
        />
        <DialogFooter>
          <DialogClose render={<Button variant="outline" disabled={pending} />}>
            {t("cancel")}
          </DialogClose>
          {onApprove ? (
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

/**
 * The approval's fields: the amount in đồng, kept within 1đ and the order's amount (a number over it becomes it
 * as it is typed, one under 1đ becomes 1đ when the field is left), the way, the note.
 */
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
  const id = useId();
  // What is in the amount while it is being typed, which may be empty or under 1đ for a moment.
  const [draft, setDraft] = useState<string>();

  return (
    <>
      <Field>
        <FieldLabel htmlFor={`${id}-amount`}>{t("amount")}</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id={`${id}-amount`}
            inputMode="numeric"
            autoComplete="off"
            value={draft ?? String(request.amountVnd)}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "").slice(0, 9);
              if (digits === "") {
                setDraft("");
                return;
              }
              const typed = Number(digits);
              if (typed > orderAmountVnd) {
                setDraft(undefined);
                onChange({ amountVnd: orderAmountVnd });
              } else {
                setDraft(typed < 1 ? digits : undefined);
                onChange({ amountVnd: Math.max(typed, 1) });
              }
            }}
            onBlur={() => {
              if (draft !== undefined) {
                onChange({ amountVnd: Math.min(orderAmountVnd, Math.max(1, Number(draft || 1))) });
              }
              setDraft(undefined);
            }}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>đ</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <FieldSet>
        <FieldLegend variant="label">{t("way")}</FieldLegend>
        <ToggleGroup
          variant="outline"
          aria-label={t("way")}
          value={[request.way]}
          onValueChange={(values) => {
            // A pressed way stays pressed: one is always chosen.
            const way = values.find((each) => each !== request.way) as RefundWay | undefined;
            if (way) onChange({ way });
          }}
        >
          {refundWays.map((way) => (
            <ToggleGroupItem key={way} value={way} className="h-11">
              {t(`ways.${way}`)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>
      <Field>
        <FieldLabel htmlFor={`${id}-note`}>{t("note")}</FieldLabel>
        <Textarea
          id={`${id}-note`}
          value={request.note}
          maxLength={300}
          onChange={(event) => onChange({ note: event.target.value })}
        />
      </Field>
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
      toast.add({ title: t("done", { code }), type: "success", timeout: 5000 });
      onOpenChange(false);
      setReason("");
    } catch {
      toast.add({ title: t("failed", { code }), type: "error", timeout: 5000 });
    } finally {
      setPending(false);
    }
  }

  const action = (
    <Button
      variant="destructive"
      disabled={pending || !onReject || !canReject(reason)}
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
        <RejectRefundFields reason={reason} onReason={setReason} />
        <DialogFooter>
          <DialogClose render={<Button variant="outline" disabled={pending} />}>
            {t("cancel")}
          </DialogClose>
          {onReject ? (
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
    <Field>
      <FieldLabel htmlFor={id}>{t("reason")}</FieldLabel>
      <Textarea
        id={id}
        value={reason}
        required
        maxLength={300}
        onChange={(event) => onReason(event.target.value)}
      />
    </Field>
  );
}
