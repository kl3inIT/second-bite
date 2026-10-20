import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { IssuesPage } from "@/features/admin/issues/issues-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/issues">) {
  return adminMetadata(params, "issues");
}

// The problem reports (SEC-62, Figma AD-BL1, AD-BL4), empty until SEC-13 builds them.
export default function AdminIssues({ searchParams }: PageProps<"/[locale]/admin/issues">) {
  return (
    <AdminPageGate page="issues">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <IssuesPage query={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
