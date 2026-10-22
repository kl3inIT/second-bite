import { StoreIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

// The way back to the shop the customers use, beside the language capsule of a store's header: a capsule of the
// same shape and height, with its word on a desktop and only the icon on a phone, where the word is for assistive
// technology. The target around it is 44px.
export function ShopLink() {
  const t = useTranslations("StoreMenu");

  return (
    <Link
      href="/"
      className="group/shop -my-1.5 flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
    >
      <span className="flex h-8 items-center gap-1.5 rounded-full border border-header-border bg-header-raised px-2.5 text-label-strong text-header-raised-foreground transition-colors group-hover/shop:bg-secondary">
        <StoreIcon aria-hidden className="size-4" />
        <span className="max-md:sr-only">{t("shop")}</span>
      </span>
    </Link>
  );
}
