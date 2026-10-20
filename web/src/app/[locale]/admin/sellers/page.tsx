import { useTranslations } from "next-intl";
import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { SellersPage } from "@/features/admin/sellers/sellers-page";
import { SellersSkeleton } from "@/features/admin/sellers/sellers-skeleton";
import { PageHeader } from "@/features/admin/ui/page-header";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/sellers">) {
  return adminMetadata(params, "sellers");
}

// The stores (SEC-62, Figma AD-Q1 to AD-Q11, AD-TT1 to AD-TT4): the status cards, the filters and the table.
export default function AdminSellers({ searchParams }: PageProps<"/[locale]/admin/sellers">) {
  const t = useTranslations("admin.shell.pages.sellers");
  return (
    <AdminPageGate page="sellers">
      <PageHeader title={t("label")} />
      <Suspense fallback={<SellersSkeleton />}>
        <SellersPage query={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
