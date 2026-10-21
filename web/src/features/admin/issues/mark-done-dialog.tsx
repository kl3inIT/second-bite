"use client";

import { CheckIcon } from "lucide-react";
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

const outcomes = ["refunded", "replaced", "explained", "invalid"] as const;
type Outcome = (typeof outcomes)[number];

/**
 * Closing a report (Figma AD-BL3): how it ended, one of four, each on its own card, and a note the customer gets.
 * Closing waits for SEC-13's backend, so the action stays off ("Sắp có") while the form can be filled.
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
  const issues = useTranslations("admin.issues");
  const shell = useTranslations("admin.shell");
  const id = useId();
  const [outcome, setOutcome] = useState<Outcome>("refunded");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title", { code })}</AlertDialogTitle>
        </AlertDialogHeader>
        <FieldGroup>
          <FieldSet>
            <FieldLegend id={`${id}-outcome`} variant="label">
              {t("outcome")}
            </FieldLegend>
            <RadioGroup
              aria-labelledby={`${id}-outcome`}
              value={outcome}
              onValueChange={(next) => setOutcome(next as Outcome)}
            >
              {outcomes.map((value) => (
                <FieldLabel key={value} htmlFor={`${id}-${value}`}>
                  <Field orientation="horizontal">
                    <RadioGroupItem value={value} id={`${id}-${value}`} />
                    <FieldContent>
                      <FieldTitle>{t(`outcomes.${value}`)}</FieldTitle>
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
              <AlertDialogAction disabled>
                <CheckIcon data-icon="inline-start" aria-hidden />
                {t("confirm")}
              </AlertDialogAction>
            </TooltipTrigger>
            <TooltipContent>{issues("soon")}</TooltipContent>
          </Tooltip>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
