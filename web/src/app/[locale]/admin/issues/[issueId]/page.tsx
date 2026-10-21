import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { IssueDetailPage } from "@/features/admin/issues/issue-detail-page";
import { getAdminIssue } from "@/features/admin/issues/issues-source";

export async function generateMetadata({ params }: PageProps<"/[locale]/admin/issues/[issueId]">) {
  const { issueId } = await params;
  const issue = await getAdminIssue(issueId);
  return adminMetadata(params, { title: issue?.code ?? issueId });
}

// One problem report (SEC-62, Figma AD-BL2, AD-BL3); not found until SEC-13 builds the reports.
export default function AdminIssue({ params }: PageProps<"/[locale]/admin/issues/[issueId]">) {
  return (
    <AdminPageGate page="issueDetail">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <IssueDetailPage params={params} />
      </Suspense>
    </AdminPageGate>
  );
}
