import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

// The discount in a photograph's top left corner, "Giảm 55%" (DESIGN.md › Discount label, The One Label
// Rule). The card gives the outer corner its own radius through `className`; the inner corner is `md`.
export function DiscountLabel({ percent, className }: { percent: number; className?: string }) {
  const t = useTranslations("OfferCard");

  return (
    <p
      className={cn(
        "absolute top-0 left-0 rounded-br-md bg-deal px-2.5 py-1 text-label-strong text-deal-foreground",
        className,
      )}
    >
      {t("discount", { percent })}
    </p>
  );
}
