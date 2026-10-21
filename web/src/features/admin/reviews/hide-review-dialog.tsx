"use client";

import { BanIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { type HideReason, hideReasons } from "./review";

/**
 * Hiding a review (Figma AD-DG2): why, one of three, each on its own card, and a note only admins read. Hiding
 * waits for a backend that keeps reviews, so the action stays off ("Sắp có") while the form can be filled.
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
  const reviews = useTranslations("admin.reviews");
  const shell = useTranslations("admin.shell");
  const id = useId();
  const [reason, setReason] = useState<HideReason>("language");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title", { name: customerName })}</AlertDialogTitle>
        </AlertDialogHeader>
        <FieldGroup>
          <FieldSet>
            <FieldLegend id={`${id}-reason`} variant="label">
              {t("reason")}
            </FieldLegend>
            <RadioGroup
              aria-labelledby={`${id}-reason`}
              value={reason}
              onValueChange={(next) => setReason(next as HideReason)}
            >
              {hideReasons.map((value) => (
                <FieldLabel key={value} htmlFor={`${id}-${value}`}>
                  <Field orientation="horizontal">
                    <RadioGroupItem value={value} id={`${id}-${value}`} />
                    <FieldContent>
                      <FieldTitle>{t(`reasons.${value}`)}</FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>
          <Field>
            <FieldLabel htmlFor={`${id}-note`}>{t("note")}</FieldLabel>
            <Textarea id={`${id}-note`} rows={3} />
          </Field>
        </FieldGroup>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">{shell("confirm.cancel")}</AlertDialogCancel>
          <Tooltip>
            <TooltipTrigger render={<span className="flex" />}>
              <AlertDialogAction variant="destructive" disabled>
                <BanIcon data-icon="inline-start" aria-hidden />
                {t("confirm")}
              </AlertDialogAction>
            </TooltipTrigger>
            <TooltipContent>{reviews("soon")}</TooltipContent>
          </Tooltip>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
