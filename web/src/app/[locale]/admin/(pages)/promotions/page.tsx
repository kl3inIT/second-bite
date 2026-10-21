import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { PromotionsPage } from "@/features/admin/promotions/promotions-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/promotions">) {
  return adminMetadata(params, "promotions");
}

// The promotion codes (SEC-62, Figma AD-MK1 and the sheet AD-MK2), empty until a backend keeps codes.
export default function AdminPromotions({ searchParams }: PageProps<"/[locale]/admin/promotions">) {
  return (
    <AdminPageGate page="promotions">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <PromotionsPage searchParams={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
