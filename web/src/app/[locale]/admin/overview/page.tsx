import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { OverviewPage } from "@/features/admin/overview/overview-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/overview">) {
  return adminMetadata(params, "overview");
}

// The admin's dashboard (SEC-62, Figma AD-TQ1, AD-TQ2); `?range=7d` or `30d` widens it from today.
export default function AdminOverview({ searchParams }: PageProps<"/[locale]/admin/overview">) {
  return (
    <AdminPageGate page="overview">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <OverviewPage query={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
