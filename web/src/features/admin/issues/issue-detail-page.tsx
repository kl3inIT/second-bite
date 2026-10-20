import { notFound } from "next/navigation";

import { IssueDetail } from "./issue-detail";
import { getAdminIssue } from "./issues-source";

/** One report, or the admin's not-found page, which keeps the shell (AD-TT5). It renders in Suspense. */
export async function IssueDetailPage({ issueId }: { issueId: Promise<string> }) {
  const issue = await getAdminIssue(await issueId);
  if (!issue) notFound();
  return <IssueDetail issue={issue} />;
}
