"use client";

import { BanIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Textarea } from "@/components/ui/textarea";

import { ChoiceCards } from "../issues/choice-cards";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { type HideReason, hideReasons } from "./review";

/**
 * Hiding a review (Figma AD-DG2): why, one of three, and a note only admins read. Hiding waits for a backend that
 * keeps reviews, so the action stays off ("Sắp có") while the form can be filled.
 */
export function HideReviewDialog({
  customerName,
  open,
  onOpenChange,
}: {
  customerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("admin.reviews.hideDialog");
  const soon = useTranslations("admin.reviews")("soon");
  const noteId = useId();
  const [reason, setReason] = useState<HideReason>("language");

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title", { name: customerName })}
      confirmLabel={t("confirm")}
      confirmIcon={BanIcon}
      destructive
      confirmDisabled
      confirmTitle={soon}
      onConfirm={() => undefined}
      form={
        <>
          <ChoiceCards
            label={t("reason")}
            value={reason}
            onChange={setReason}
            choices={hideReasons.map((value) => ({ value, label: t(`reasons.${value}`) }))}
          />
          <div className="flex flex-col gap-2">
            <label htmlFor={noteId} className="text-label-strong text-foreground">
              {t("note")}
            </label>
            <Textarea id={noteId} rows={3} />
          </div>
        </>
      }
    />
  );
}
