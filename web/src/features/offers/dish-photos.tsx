"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { cn } from "@/lib/utils";

import type { OfferSummary } from "./offer";

// The photographs of a dish on its sheet (SEC-119): the one chosen across the whole width, which starts at the
// cover, and when the dish has more, a small button for each to look at it. `children` sit over the big one (the
// discount's badge).
export function DishPhotos({
  offer,
  sizes,
  children,
}: {
  offer: Pick<OfferSummary, "photo" | "photos">;
  sizes: string;
  children?: React.ReactNode;
}) {
  const t = useTranslations("Dish");
  const [selected, setSelected] = useState(0);
  const photos = offer.photos.length > 0 ? offer.photos : [offer.photo];
  const current = photos[selected] ?? photos[0];

  return (
    <div className="flex shrink-0 flex-col gap-2">
      <div className="relative h-50 overflow-hidden rounded-xl bg-muted">
        <Image
          src={`/api${current.largePath}`}
          alt=""
          fill
          sizes={sizes}
          // The backend already writes each photo at 400 and 1600 px without metadata.
          unoptimized
          className="object-cover"
        />
        {children}
      </div>
      {photos.length > 1 && (
        <ul aria-label={t("photos")} className="flex gap-2">
          {photos.map((photo, index) => (
            <li key={photo.id}>
              <button
                type="button"
                aria-label={t("photoNumber", { number: index + 1, total: photos.length })}
                aria-pressed={index === selected}
                onClick={() => setSelected(index)}
                className={cn(
                  "relative block size-14 overflow-hidden rounded-lg bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring",
                  index === selected ? "ring-2 ring-primary" : "opacity-80",
                )}
              >
                <Image
                  src={`/api${photo.smallPath}`}
                  alt=""
                  fill
                  sizes="56px"
                  unoptimized
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
