"use client";

import { HeartIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { keptIds } from "@/lib/kept-ids";
import { cn } from "@/lib/utils";

// Kept in this browser until accounts keep favourites (SEC-49 decision 5); "Yêu thích" in the bottom bar
// opens them once they do.
const hearts = keptIds("secondbite.hearts");

/** A text action in Tasco blue with its icon, as the booking card's "Lưu món" and "Chia sẻ". */
export const labelledAction =
  "-mx-1 flex min-h-11 items-center gap-1.5 rounded-md px-1 text-body-sm font-medium text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none";

// The heart on a card's photograph (Figma K1b "lưới món", K1f): white, filled once the dish is kept. `float`
// is the dish page's, a white round button with the heart in Tasco blue (Figma K4); `labelled` is the wide
// screen's booking card, the heart and "Lưu món" in Tasco blue (Figma WK4).
export function HeartButton({
  offerId,
  name,
  float = false,
  labelled = false,
  className,
}: {
  offerId: string;
  name: string;
  float?: boolean;
  labelled?: boolean;
  className?: string;
}) {
  const t = useTranslations("OfferCard");
  const dish = useTranslations("Dish");
  const kept = hearts.useHas(offerId);

  if (labelled) {
    return (
      <button
        type="button"
        aria-pressed={kept}
        onClick={() => hearts.toggle(offerId)}
        className={cn(labelledAction, className)}
      >
        <HeartIcon aria-hidden strokeWidth={2} className={cn("size-4", kept && "fill-current")} />
        {dish("save")}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={kept}
      aria-label={t("heart", { name })}
      onClick={() => hearts.toggle(offerId)}
      className={
        float
          ? buttonVariants({ variant: "float", size: "float", className })
          : cn(
              "absolute z-10 flex size-11 items-center justify-center rounded-full text-card focus-visible:ring-3 focus-visible:ring-card focus-visible:outline-none",
              className,
            )
      }
    >
      <HeartIcon
        aria-hidden
        strokeWidth={float ? 2.2 : 2}
        className={cn(float ? "size-5" : "size-5.5 drop-shadow-md", kept && "fill-current")}
      />
    </button>
  );
}
