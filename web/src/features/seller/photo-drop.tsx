import { ImagePlusIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

// The place to choose a dish's photo (Figma P2 › Ảnh món, C1): a dashed box with the words, and once a photo is
// chosen the photo itself across the box's whole width, so the person sees what customers will see. The input
// is the box's label, so a tap anywhere in it opens the file picker.
export function PhotoDrop({
  id,
  fileName,
  preview,
  disabled,
  onChange,
}: {
  id: string;
  /** The chosen file's name, once there is one. */
  fileName?: string;
  /** What to show: the chosen file, or the photo the dish already has. */
  preview?: string;
  disabled?: boolean;
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
        onChange={(event) => onChange(event.target.files?.[0])}
      />
    </label>
  );
}
