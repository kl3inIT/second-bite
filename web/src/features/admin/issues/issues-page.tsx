import { readIssueQuery } from "./issue";
import { IssuesList } from "./issues-list";
import { listAdminIssues } from "./issues-source";

/** The problem reports for the address's tab and filters (Figma AD-BL1). It reads the request, so it renders in Suspense. */
export async function IssuesPage({
  query: pendingQuery,
}: {
  query: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = readIssueQuery(await pendingQuery);
  const list = await listAdminIssues(query);
  return (
    <IssuesList
      query={query}
      rows={list.items}
      total={list.total}
      counts={list.counts}
      handlers={list.handlers}
    />
  );
}
