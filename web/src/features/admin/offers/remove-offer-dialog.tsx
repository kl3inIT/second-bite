"use client";

import { BanIcon, CheckIcon, EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  const offers = useTranslations("admin.offers");
  const shell = useTranslations("admin.shell");
  const id = useId();
  const [reason, setReason] = useState<RemoveReason>("food_safety");
  const consequences = [
    { icon: EyeIcon, text: t("consequences.hidden") },
    { icon: BanIcon, text: t("consequences.store") },
    { icon: CheckIcon, text: t("consequences.orders") },
  ];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription render={<div />}>
          <p>{t("after")}</p>
          <ul className="mt-2 flex flex-col gap-2">
            {consequences.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-2">
                <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </AlertDialogDescription>
        <FieldGroup>
          <FieldSet>
            <FieldLegend id={`${id}-reason`} variant="label">
              {t("reason")}
            </FieldLegend>
            <RadioGroup
              aria-labelledby={`${id}-reason`}
              value={reason}
              onValueChange={(next) => setReason(next as RemoveReason)}
            >
              {removeReasons.map((value) => (
                <Field key={value} orientation="horizontal">
                  <RadioGroupItem value={value} id={`${id}-${value}`} />
                  <FieldLabel htmlFor={`${id}-${value}`}>{t(`reasons.${value}`)}</FieldLabel>
                </Field>
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
            <TooltipContent>{offers("soon")}</TooltipContent>
          </Tooltip>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
