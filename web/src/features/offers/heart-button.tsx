"use client";

import { HeartIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { keptIds } from "@/lib/kept-ids";
import { cn } from "@/lib/utils";

// Kept in this browser until accounts keep favourites (SEC-49 decision 5); "Yêu thích" in the bottom bar
// opens them once they do.
const hearts = keptIds("secondbite.hearts");

// The heart on a card's photograph (Figma K1b "lưới món", K1f): white, filled once the dish is kept.
export function HeartButton({
  offerId,
  name,
  className,
}: {
  offerId: string;
  name: string;
  className?: string;
}) {
  const t = useTranslations("OfferCard");
  const kept = hearts.useHas(offerId);

  return (
    <button
      type="button"
      aria-pressed={kept}
      aria-label={t("heart", { name })}
      onClick={() => hearts.toggle(offerId)}
      className={cn(
        "absolute flex size-11 items-center justify-center rounded-full text-card focus-visible:ring-3 focus-visible:ring-card focus-visible:outline-none",
        className,
      )}
    >
      <HeartIcon
        aria-hidden
        strokeWidth={2}
        className={cn("size-5.5 drop-shadow-sm", kept && "fill-current")}
      />
    </button>
  );
}
