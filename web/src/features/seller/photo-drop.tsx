"use client";

import { ImagePlusIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { useFieldValidity } from "@/components/form/form-context";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

/** A photo just chosen from the device, with the address that draws it before it is sent. */
export type ChosenPhoto = { file: File; preview: string };

// The place to choose a dish's photo (Figma P2 › Ảnh món, C1): a dashed box with the words, and once a photo is
// chosen the photo itself across the box's whole width, so the person sees what customers will see. The input
// is the box's label, so a tap anywhere in it opens the file picker.
export function PhotoDrop({
  id,
  fileName,
  preview,
  disabled,
  invalid,
  describedBy,
  onChange,
}: {
  id: string;
  /** The chosen file's name, once there is one. */
  fileName?: string;
  /** What to show: the chosen file, or the photo the dish already has. */
  preview?: string;
  disabled?: boolean;
  /** The form found no photo where one is needed: the input says so, and takes the focus. */
  invalid?: boolean;
  describedBy?: string;
  onChange: (file: File | undefined) => void;
}) {
  const t = useTranslations("DishForm");

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-dashed border-primary/30 bg-background p-3 text-center transition-colors focus-within:ring-3 focus-within:ring-ring/50 hover:bg-secondary",
        // Empty, the box is as large as the photo will be, so the person sees where it goes.
        !preview && "aspect-4/3 w-full",
      )}
    >
      {preview && (
        <span className="relative mb-2 aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={preview}
            alt=""
            fill
            sizes="(min-width: 640px) 36rem, 100vw"
            unoptimized
            className="object-cover"
          />
        </span>
      )}
      {!preview && <ImagePlusIcon aria-hidden className="size-6 text-link" />}
      <span className="max-w-full truncate text-body-sm-strong text-link">
        {fileName ?? (preview ? t("changePhoto") : t("choosePhoto"))}
      </span>
      {!preview && <span className="text-note text-muted-foreground">{t("photoHint")}</span>}
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.files?.[0])}
      />
    </label>
  );
}

/**
 * The photo of a form's dish, as a field of `useAppForm`: its value is the photo chosen, or undefined while the
 * dish keeps the one it has (`current`, a path of the API) or has none yet.
 */
export function PhotoField({
  label,
  current,
  disabled,
}: {
  label: string;
  current?: string;
  disabled?: boolean;
}) {
  const { field, invalid, errors, ids } = useFieldValidity<ChosenPhoto | undefined>();
  const chosen = field.state.value;

  function choose(file: File | undefined) {
    if (chosen) URL.revokeObjectURL(chosen.preview);
    field.handleChange(file ? { file, preview: URL.createObjectURL(file) } : undefined);
  }

  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={ids.control}>{label}</FieldLabel>
      <PhotoDrop
        id={ids.control}
        fileName={chosen?.file.name}
        preview={chosen?.preview ?? current}
        disabled={disabled}
        invalid={invalid}
        describedBy={invalid ? ids.error : undefined}
        onChange={choose}
      />
      {invalid && <FieldError id={ids.error} errors={errors} />}
    </Field>
  );
}
