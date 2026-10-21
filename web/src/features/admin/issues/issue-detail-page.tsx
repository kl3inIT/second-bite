import { notFound } from "next/navigation";

import { IssueDetail } from "./issue-detail";
import { getAdminIssue } from "./issues-source";

/**
 * One report, or the admin's not-found page, which keeps the shell (AD-TT5). It reads the address inside its
 * Suspense, as a store's page does, so the address is read where the page waits for it.
 */
export async function IssueDetailPage({ params }: { params: Promise<{ issueId: string }> }) {
  const { issueId } = await params;
  const issue = await getAdminIssue(issueId);
  if (!issue) notFound();
  return <IssueDetail issue={issue} />;
}
