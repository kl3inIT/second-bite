import { StarIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 } as const;

// The seller's rating, "4,7 ★" (Figma "rating"). `badge` is the white tag on a small card's photograph
// (Figma K1b); otherwise it sits on a photograph's scrim. The star is in `rating` either way.
export function Rating({
  rating,
  badge = false,
  className,
}: {
  rating: number;
  badge?: boolean;
  className?: string;
}) {
  const t = useTranslations("OfferCard");
  const format = useFormatter();
  const value = format.number(rating, ONE_DECIMAL);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-0.5 text-label-strong",
        badge && "rounded-sm bg-card px-1.5 text-foreground",
        className,
      )}
    >
      {!badge && <StarIcon aria-hidden className="size-3 fill-rating text-rating" />}
      <span aria-hidden>{value}</span>
      {badge && <StarIcon aria-hidden className="size-3 fill-rating text-rating" />}
      <span className="sr-only">{t("rating", { rating: value })}</span>
    </span>
  );
}
