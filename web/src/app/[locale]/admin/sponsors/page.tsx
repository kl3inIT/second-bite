import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { SponsorsPage } from "@/features/admin/sponsors/sponsors-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/sponsors">) {
  return adminMetadata(params, "sponsors");
}

// The places sold to stores and sponsors (SEC-62, Figma AD-MK7), empty until a backend sells them.
export default function AdminSponsors({ searchParams }: PageProps<"/[locale]/admin/sponsors">) {
  return (
    <AdminPageGate page="sponsors">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <SponsorsPage searchParams={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
