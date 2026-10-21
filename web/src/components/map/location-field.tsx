"use client";

import { MapPinIcon, MapPinnedIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldTitle } from "@/components/ui/field";

import { LocationPicker, type Point } from "./location-picker";
import { StoreMap } from "./store-map";

/**
 * Where a store is, as a form field (SEC-66, design decisions 3 and 4): a small map with the pin and "Chỉnh vị
 * trí", as Uber Eats, Tripadvisor and Fresha put one in an address form; before a pin is set, a button that opens
 * the map. The location is required, so a store is never placed where nobody chose.
 */
export function LocationField({
  id,
  value,
  start,
  onChange,
  describe,
  error,
  disabled,
}: {
  id: string;
  value?: Point;
  /** Where the map opens before a pin is set: where the person stands, when known. */
  start?: Point;
  onChange: (point: Point) => void;
  describe: (point: Point) => Promise<string>;
  /** Why the field is refused, shown under it. */
  error?: string;
  disabled?: boolean;
}) {
  const t = useTranslations("StoreLocation");
  const [open, setOpen] = useState(false);
  const errorId = `${id}-problem`;

  return (
    <Field data-invalid={error ? true : undefined}>
      {/* A title, not a label: the button keeps its own name, "Ghim trên bản đồ" or "Chỉnh vị trí". */}
      <FieldTitle>{t("label")}</FieldTitle>
      {value ? (
        <StoreMap point={value} label={t("previewLabel")} />
      ) : (
        <div className="flex h-24 items-center justify-center gap-2 rounded-xl border border-dashed border-border text-body-sm text-muted-foreground">
          <MapPinIcon aria-hidden className="size-5" />
          {t("empty")}
        </div>
      )}
      <Button
        id={id}
        type="button"
        variant={value ? "outline" : "secondary"}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : `${id}-hint`}
        onClick={() => setOpen(true)}
      >
        <MapPinnedIcon data-icon="inline-start" aria-hidden />
        {value ? t("adjust") : t("pin")}
      </Button>
      {error ? (
        <FieldError id={errorId}>{error}</FieldError>
      ) : (
        <FieldDescription id={`${id}-hint`}>{t("hint")}</FieldDescription>
      )}
      <LocationPicker
        open={open}
        onOpenChange={setOpen}
        start={value ?? start}
        describe={describe}
        onConfirm={onChange}
      />
    </Field>
  );
}
