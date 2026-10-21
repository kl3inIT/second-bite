import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

// The discount in a photograph's top left corner, "Giảm 55%" (DESIGN.md › Discount label, The One Label
// Rule). The card gives the outer corner its own radius through `className`; the inner corner is `md`.
export function DiscountLabel({ percent, className }: { percent: number; className?: string }) {
  const t = useTranslations("OfferCard");

  return <PhotoLabel className={className}>{t("discount", { percent })}</PhotoLabel>;
}

/** The corner label itself, which an announcement fills with the portions expected ("Dự kiến 6 phần"). */
export function PhotoLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "absolute top-0 left-0 rounded-br-md bg-deal px-2.5 py-1 text-label-strong text-deal-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * The discount on a dish's photograph in the seller's rows and the dish's sheet (Figma K4b, K4a): "-57%" on Sale Red,
 * 6px in from the top left corner.
 */
export function DiscountBadge({ percent }: { percent: number }) {
  const t = useTranslations("OfferCard");

  return (
    <p className="absolute top-1.5 left-1.5 rounded-sm bg-sale px-1.5 py-0.5 font-display text-label-strong text-destructive-foreground">
      {t("badge", { percent })}
    </p>
  );
}
