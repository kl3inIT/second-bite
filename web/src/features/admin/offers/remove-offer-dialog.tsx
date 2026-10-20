"use client";

import { BanIcon, CheckIcon, EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { ConfirmDialog, ConsequenceList } from "../ui/confirm-dialog";
import { type RemoveReason, removeReasons } from "./offer";

/**
 * Taking a post down for a violation (Figma AD-BD3): what follows (it leaves search at once, the store sees it as
 * "Gỡ do vi phạm" with the reason and cannot sell it again, held orders stay held until the window ends; admin-qa,
 * awaiting the founder), the reason and a note to the store. Removal waits for its backend, so the action stays
 * off ("Sắp có") while the form can be filled.
 */
export function RemoveOfferDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("admin.offers.removeDialog");
  const soon = useTranslations("admin.offers")("soon");
  const reasonId = useId();
  const noteId = useId();
  const [reason, setReason] = useState<RemoveReason>("food_safety");

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title")}
      confirmLabel={t("confirm")}
      confirmIcon={BanIcon}
      destructive
      confirmDisabled
      confirmTitle={soon}
      onConfirm={() => undefined}
      form={
        <>
          <div className="flex flex-col gap-2">
            <p id={reasonId} className="text-label-strong text-foreground">
              {t("reason")}
            </p>
            <RadioGroup
              aria-labelledby={reasonId}
              value={reason}
              onValueChange={(next) => setReason(next as RemoveReason)}
            >
              {removeReasons.map((value) => (
                <label
                  key={value}
                  className="flex min-h-11 cursor-pointer items-center gap-3 text-body-sm text-foreground"
                >
                  <RadioGroupItem value={value} />
                  {t(`reasons.${value}`)}
                </label>
              ))}
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={noteId} className="text-label-strong text-foreground">
              {t("note")}
            </label>
            <Textarea id={noteId} rows={3} />
          </div>
        </>
      }
    >
      <ConsequenceList
        title={t("after")}
        items={[
          { icon: EyeIcon, text: t("consequences.hidden") },
          { icon: BanIcon, text: t("consequences.store") },
          { icon: CheckIcon, text: t("consequences.orders") },
        ]}
      />
    </ConfirmDialog>
  );
}
