"use client";

import { MapPinIcon, MapPinnedIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";

import { LocationPicker, type Point } from "./location-picker";
import { StoreMap } from "./store-map";

/**
 * Where a store is, as a form's control (SEC-66, design decisions 3 and 4): a small map with the pin and "Chỉnh vị
 * trí", as Uber Eats, Tripadvisor and Fresha put one in an address form; before a pin is set, a button that opens
 * the map. Inside `form.AppField`, it takes its ids and its validity from `useFieldValidity`; the button is the
 * control the form focuses when the location is refused.
 */
export function LocationField({
  ids,
  value,
  onChange,
  describe,
  invalid,
  error,
}: {
  ids: { control: string; hint: string; error: string };
  value?: Point;
  onChange: (point: Point) => void;
  describe: (point: Point) => Promise<string>;
  invalid?: boolean;
  /** The field's `FieldError`, shown in place of the hint while the field is invalid. */
  error?: ReactNode;
}) {
  const t = useTranslations("StoreLocation");
  const [open, setOpen] = useState(false);

  return (
    <Field data-invalid={invalid || undefined}>
      {/* A title, not a label: the button keeps its own name, "Ghim trên bản đồ" or "Chỉnh vị trí". */}
      <FieldTitle>{t("label")}</FieldTitle>
      {value ? (
        <StoreMap
          point={value}
          label={t("previewLabel")}
          onOpen={() => setOpen(true)}
          openLabel={t("openMap")}
        />
      ) : (
        <div className="flex h-24 items-center justify-center gap-2 rounded-xl border border-dashed border-border text-body-sm text-muted-foreground">
          <MapPinIcon aria-hidden className="size-5" />
          {t("empty")}
        </div>
      )}
      <Button
        id={ids.control}
        type="button"
        variant={value ? "outline" : "secondary"}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? ids.error : ids.hint}
        onClick={() => setOpen(true)}
      >
        <MapPinnedIcon data-icon="inline-start" aria-hidden />
        {value ? t("adjust") : t("pin")}
      </Button>
      {invalid ? error : <FieldDescription id={ids.hint}>{t("hint")}</FieldDescription>}
      <LocationPicker
        open={open}
        onOpenChange={setOpen}
        start={value}
        describe={describe}
        onConfirm={onChange}
      />
    </Field>
  );
}
