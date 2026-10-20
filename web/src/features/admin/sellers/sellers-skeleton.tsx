import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";

const rows = Array.from({ length: 8 }, (_, index) => index);

/**
 * The stores list while it loads (Figma AD-TT3): the three cards, the filter bar and eight rows in their
 * shapes, under the table's real headings. Screen readers hear that it is loading.
 */
export function SellersSkeleton() {
  const t = useTranslations("admin.sellers");
  return (
    <output aria-label={t("loading")} className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((card) => (
          <div
            key={card}
            className="flex items-center gap-3.5 rounded-xl border border-border bg-card px-4.5 py-4"
          >
            <Skeleton className="size-11 shrink-0" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-14" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-11 w-full" />
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="flex h-11 items-center gap-6 bg-muted px-4 text-label-strong text-muted-foreground">
          <span className="w-56">{t("columns.name")}</span>
          <span className="flex-1">{t("columns.address")}</span>
          <span className="hidden w-32 md:block">{t("columns.phone")}</span>
          <span className="hidden w-32 md:block">{t("columns.status")}</span>
          <span className="hidden w-28 md:block">{t("columns.updatedAt")}</span>
        </div>
        {rows.map((row) => (
          <div key={row} className="flex h-16 items-center gap-6 border-t border-border px-4">
            <span className="flex w-56 items-center gap-2.5">
              <Skeleton className="size-9 shrink-0" />
              <Skeleton className="h-3 flex-1" />
            </span>
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="hidden h-3 w-32 md:block" />
            <Skeleton shape="circle" className="hidden h-6 w-32 md:block" />
            <Skeleton className="hidden h-3 w-28 md:block" />
          </div>
        ))}
      </div>
    </output>
  );
}
