import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";

/** A store's page while it loads: the cover, the name row, the figures and a card, in their shapes. */
export function SellerSkeleton() {
  const t = useTranslations("admin.sellers.detail");
  return (
    <output aria-label={t("loading")} className="flex flex-col gap-5">
      <Skeleton shape="card" className="h-28 w-full md:h-40" />
      <div className="flex items-center gap-3">
        <Skeleton className="size-14 shrink-0" />
        <Skeleton className="h-6 w-48" />
      </div>
      <Skeleton shape="card" className="h-17 w-full" />
      <Skeleton shape="card" className="h-60 w-full" />
    </output>
  );
}
