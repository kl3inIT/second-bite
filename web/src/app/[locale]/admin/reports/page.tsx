import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { ReportsPage } from "@/features/admin/reports/reports-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/reports">) {
  return adminMetadata(params, "reports");
}

// The admin's reports (SEC-62, Figma AD-BC1, AD-BC2); `?from=&to=` picks the days, `?seller=` one store.
export default function AdminReports({ searchParams }: PageProps<"/[locale]/admin/reports">) {
  return (
    <AdminPageGate page="reports">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <ReportsPage query={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
