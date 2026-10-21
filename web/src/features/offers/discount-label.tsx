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
