"use client";

import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Textarea } from "@/components/ui/textarea";

import { ConfirmDialog } from "../ui/confirm-dialog";
import { ChoiceCards } from "../ui/choice-cards";

const outcomes = ["refunded", "replaced", "explained", "invalid"] as const;
type Outcome = (typeof outcomes)[number];

/**
 * Closing a report (Figma AD-BL3): how it ended, one of four, and a note the customer gets. Closing waits for
 * SEC-13's backend, so the action stays off ("Sắp có") while the form can be filled.
 */
export function MarkDoneDialog({
  code,
  open,
  onOpenChange,
}: {
  code: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("admin.issues.done");
  const soon = useTranslations("admin.issues")("soon");
  const noteId = useId();
  const [outcome, setOutcome] = useState<Outcome>("refunded");

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title", { code })}
      confirmLabel={t("confirm")}
      confirmIcon={CheckIcon}
      confirmDisabled
      confirmTitle={soon}
      onConfirm={() => undefined}
      form={
        <>
          <ChoiceCards
            label={t("outcome")}
            value={outcome}
            onChange={setOutcome}
            choices={outcomes.map((value) => ({ value, label: t(`outcomes.${value}`) }))}
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
