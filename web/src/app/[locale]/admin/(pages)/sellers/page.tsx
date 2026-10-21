import { useTranslations } from "next-intl";
import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { isFeatureOn } from "@/features/admin/features";
import { OpenStoreButton } from "@/features/admin/sellers/open-store-sheet";
import { SellersPage } from "@/features/admin/sellers/sellers-page";
import { SellersSkeleton } from "@/features/admin/sellers/sellers-skeleton";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/sellers">) {
  return adminMetadata(params, "sellers");
}

// The stores (SEC-62, Figma AD-Q1 to AD-Q11, AD-TT1 to AD-TT4): the status cards, the filters and the table.
// "Mở cửa hàng" (AD-OS1) waits behind the `openForOwner` flag until SEC-64 builds its request.
export default function AdminSellers({ searchParams }: PageProps<"/[locale]/admin/sellers">) {
  const t = useTranslations("admin.shell.pages.sellers");
  return (
    <AdminPageGate page="sellers">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-page-title text-foreground">{t("label")}</h1>
        {isFeatureOn("openForOwner") && <OpenStoreButton />}
      </div>
      <Suspense fallback={<SellersSkeleton />}>
        <SellersPage query={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
