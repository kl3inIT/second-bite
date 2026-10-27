"use client";

import { useTranslations } from "next-intl";

import { useFieldValidity } from "@/components/form/form-context";
import { Field, FieldLabel } from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

// What a dish is counted in, chosen rather than typed: a seller's own word would reach every card and order as it
// was written. The unit is the dish's data, shown on cards and orders as it is saved, so the words stay Vietnamese
// in both languages, as the dish's name does. A dish saved earlier with another word keeps it as one more choice.
const units = ["suất", "phần", "cái", "chiếc", "túi", "hộp", "ổ", "ly", "chai"];

/** What the dish is counted in, from the list, or the word it was saved with; a field of `useAppForm`. */
export function UnitField({ className }: { className?: string }) {
  const t = useTranslations("DishForm");
  const { field, ids } = useFieldValidity<string>();
  const unit = field.state.value;
  return (
    <Field className={cn("w-fit shrink-0", className)}>
      <FieldLabel htmlFor={ids.control}>{t("unit")}</FieldLabel>
      <NativeSelect
        id={ids.control}
        size="field"
        value={unit}
        onChange={(event) => field.handleChange(event.target.value)}
      >
        {(units.includes(unit) ? units : [...units, unit]).map((value) => (
          <NativeSelectOption key={value} value={value}>
            {value}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </Field>
  );
}
