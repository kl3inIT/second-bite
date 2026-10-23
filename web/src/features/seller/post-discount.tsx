"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { useFieldValidity } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/features/offers/format";

import { NumberInput } from "./number-input";
import { MIN_DISCOUNT_PERCENT, suggestedPrice } from "./post-draft";

const PRESETS = [20, 30, 40, 50];

/** A form field for the discount; the drawer derives the sale price. */
export function DiscountField({
  original,
  disabled,
  onValue,
}: {
  original: number;
  disabled: boolean;
  onValue: (percent: number) => void;
}) {
  const t = useTranslations("PostDrawer");
  const { field, invalid, errors, ids } = useFieldValidity<string>();
  const percent = Number(field.state.value);
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  function choose(next: number) {
    field.handleChange(String(next));
    field.handleBlur();
    onValue(next);
    setOpen(false);
  }
  return (
    <fieldset className="flex min-w-0 flex-col gap-2" disabled={disabled}>
      <legend id={ids.control} className="mb-2 text-title">
        {t("discountLabel")}
      </legend>
      <div className="grid grid-cols-5 gap-2" aria-labelledby={ids.control}>
        {PRESETS.map((value) => (
          <Button
            key={value}
            type="button"
            variant="choice"
            size="choice"
            aria-pressed={percent === value}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? ids.error : undefined}
            onClick={() => choose(value)}
          >
            {t("percent", { percent: value })}
          </Button>
        ))}
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (next) setCustom(false);
          }}
        >
          <PopoverTrigger
            disabled={disabled}
            render={<Button type="button" variant="choice" size="choice" />}
            aria-label={`${t("otherDiscount")}: ${PRESETS.includes(percent) ? t("other") : t("percent", { percent })}`}
            aria-pressed={!PRESETS.includes(percent)}
          >
            {PRESETS.includes(percent) ? t("other") : t("percent", { percent })}
          </PopoverTrigger>
          <PopoverContent align="end" variant="choices">
            {custom ? (
              <CustomDiscount
                key={percent}
                original={original}
                percent={percent}
                onCancel={() => setOpen(false)}
                onApply={choose}
              />
            ) : (
              <>
                <PopoverTitle>{t("otherDiscount")}</PopoverTitle>
                <div className="flex flex-col">
                  {[60, 70, 80, 90].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant="choice"
                      size="choice"
                      aria-pressed={percent === value}
                      onClick={() => choose(value)}
                    >
                      {t("percent", { percent: value })}
                    </Button>
                  ))}
                </div>
                <Separator />
                <Button type="button" variant="ghost" onClick={() => setCustom(true)}>
                  {t("enterDiscount")}
                </Button>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-note text-muted-foreground">
        {t("discountHint", { min: MIN_DISCOUNT_PERCENT })}
      </p>
      {invalid && <FieldError id={ids.error} errors={errors} />}
    </fieldset>
  );
}

function CustomDiscount({
  original,
  percent,
  onCancel,
  onApply,
}: {
  original: number;
  percent: number;
  onCancel: () => void;
  onApply: (percent: number) => void;
}) {
  const t = useTranslations("PostDrawer");
  const id = useId();
  const [draft, setDraft] = useState(String(percent));
  const [attempted, setAttempted] = useState(false);
  const next = Number(draft);
  const valid =
    draft !== "" && Number.isInteger(next) && next >= MIN_DISCOUNT_PERCENT && next < 100;
  const price = valid ? suggestedPrice(original, next) : undefined;
  return (
    <>
      <PopoverTitle>{t("otherDiscount")}</PopoverTitle>
      <Field data-invalid={(attempted && !valid) || undefined}>
        <FieldLabel htmlFor={id}>{t("discountLabel")}</FieldLabel>
        <NumberInput
          id={id}
          max={3}
          value={draft}
          onValueChange={setDraft}
          aria-invalid={(attempted && !valid) || undefined}
          aria-describedby={`${id}-hint`}
        />
        <p id={`${id}-hint`} className="text-note text-muted-foreground">
          {t("discountRange", { min: MIN_DISCOUNT_PERCENT })}
        </p>
        {attempted && !valid && (
          <FieldError>{t("discountInvalid", { min: MIN_DISCOUNT_PERCENT })}</FieldError>
        )}
      </Field>
      <p className="text-body-sm-strong text-primary" aria-live="polite">
        {price === undefined
          ? t("priceUnavailable")
          : t("salePreview", { price: formatPrice(price) })}
      </p>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button
          type="button"
          onClick={() => {
            setAttempted(true);
            if (valid) onApply(next);
          }}
        >
          {t("apply")}
        </Button>
      </div>
    </>
  );
}
