import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { SellerPage } from "@/features/admin/sellers/seller-page";
import { SellerSkeleton } from "@/features/admin/sellers/seller-skeleton";
import { readSeller } from "@/features/admin/sellers/sellers-source";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/admin/sellers/[sellerId]">) {
  const seller = await readSeller((await params).sellerId);
  return adminMetadata(params, { title: seller.name });
}

// A store (SEC-62, Figma AD-Q3, AD-Q4, AD-QD1 to AD-QD5): its profile, figures and tabs, and its status action.
export default function AdminSeller({
  params,
  searchParams,
}: PageProps<"/[locale]/admin/sellers/[sellerId]">) {
  return (
    <AdminPageGate page="sellerDetail">
      <Suspense fallback={<SellerSkeleton />}>
        <SellerPage params={params} query={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
