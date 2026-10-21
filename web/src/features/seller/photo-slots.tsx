"use client";

import { ImagePlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { uploadPhoto } from "@/lib/api/generated";
import { cn } from "@/lib/utils";
import { photoUrl } from "@/lib/api/photo";

/** How many photos a dish or a post shows (SEC-119): the first is the cover. */
export const MAX_PHOTOS = 3;

/** A photo of the form: one the dish already shows (`id`), or one just chosen (`file`), with what to draw of it. */
export type PhotoSlot = { key: string; preview: string; file?: File; id?: string };

/** The slots of photos a dish or an offer already shows, the cover first. */
export function slotsOf(photos: readonly { id: string; smallPath: string }[]): PhotoSlot[] {
  return photos.map((photo) => ({
    key: photo.id,
    id: photo.id,
    preview: photoUrl(photo.smallPath),
  }));
}

/** The identifiers of the slots' photos in order, the new ones uploaded first; the first is the cover. */
export async function uploadedIds(slots: readonly PhotoSlot[]): Promise<string[]> {
  const ids: string[] = [];
  for (const slot of slots) {
    if (slot.id) ids.push(slot.id);
    else if (slot.file) ids.push((await uploadPhoto({ body: slot.file })).data.id);
  }
  return ids;
}

// The photos of a dish (Figma P2, C1): three places, the first across the whole width as the cover and two
// beside each other under it. An empty place opens the file picker, a full one has a button to take its photo
// away, and a person may choose several photos at once. The input is the label's own "Ảnh món", so a screen
// reader and the form's tests find it by that name.
export function PhotoSlots({
  id,
  slots,
  disabled,
  invalid,
  describedBy,
  onChange,
}: {
  id: string;
  slots: PhotoSlot[];
  disabled?: boolean;
  /** Marks the chooser in error, so a refused submit's focus lands on it. */
  invalid?: boolean;
  describedBy?: string;
  onChange: (slots: PhotoSlot[]) => void;
}) {
  const t = useTranslations("DishForm");
  const room = MAX_PHOTOS - slots.length;

  function add(files: FileList | null) {
    const chosen = Array.from(files ?? []).slice(0, room);
    if (chosen.length === 0) return;
    onChange([
      ...slots,
      ...chosen.map((file) => ({
        key: `${file.name}-${crypto.randomUUID()}`,
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  }

  function remove(index: number) {
    const gone = slots[index];
    if (gone.file) URL.revokeObjectURL(gone.preview);
    onChange(slots.filter((_, at) => at !== index));
  }

  return (
    <div className="group/photos flex flex-col gap-2">
      <input
        id={id}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={disabled || room === 0}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => {
          add(event.target.files);
          event.target.value = "";
        }}
      />
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: MAX_PHOTOS }, (_, index) => {
          const slot = slots.at(index);
          const place = cn(
            "relative aspect-4/3 overflow-hidden rounded-xl",
            index === 0 && "col-span-2",
          );
          if (!slot) {
            return (
              <label
                key={`empty-${index}`}
                htmlFor={id}
                className={cn(
                  place,
                  "flex cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-primary/30 bg-background p-3 text-center transition-colors group-has-[:focus-visible]/photos:ring-3 group-has-[:focus-visible]/photos:ring-ring/50 hover:bg-secondary",
                )}
              >
                <ImagePlusIcon aria-hidden className="size-6 text-link" />
                <span className="text-body-sm-strong text-link">
                  {index === 0 ? t("choosePhoto") : t("addPhoto")}
                </span>
                {index === 0 && (
                  <span className="text-note text-muted-foreground">{t("photoHint")}</span>
                )}
              </label>
            );
          }
          return (
            <div key={slot.key} className={cn(place, "bg-muted")}>
              <Image
                src={slot.preview}
                alt=""
                fill
                sizes="(min-width: 640px) 36rem, 100vw"
                unoptimized
                className="object-cover"
              />
              {index === 0 && (
                <span className="absolute top-2 left-2 rounded-full bg-card/90 px-2.5 py-1 text-label-strong text-foreground">
                  {t("cover")}
                </span>
              )}
              <button
                type="button"
                aria-label={t("removePhoto", { number: index + 1 })}
                disabled={disabled}
                onClick={() => remove(index)}
                className="absolute top-0 right-0 flex size-11 items-center justify-center outline-none focus-visible:ring-3 focus-visible:ring-ring"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-foreground/70 text-background">
                  <XIcon aria-hidden className="size-4" />
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
