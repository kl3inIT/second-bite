import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { OffersPage } from "@/features/admin/offers/offers-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/offers">) {
  return adminMetadata(params, "offers");
}

// Every store's posts (SEC-62, Figma AD-BD1 to AD-BD4), empty until the offer module lists them for an admin.
export default function AdminOffers({ searchParams }: PageProps<"/[locale]/admin/offers">) {
  return (
    <AdminPageGate page="offers">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <OffersPage query={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
