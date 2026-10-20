import "server-only";

import type { AdminIssue, AdminIssueRow, IssuePerson, IssueQuery, IssueStatus } from "./issue";

export type IssueList = {
  items: AdminIssueRow[];
  /** How many reports the open tab holds, for the pagination. */
  total: number;
  /** How many reports each tab holds, once the backend counts them. */
  counts?: Record<IssueStatus, number>;
  /** The admins a report can be given to, for the handler filter. */
  handlers: IssuePerson[];
};

/**
 * The problem reports an admin sees. SEC-13 has not built the reports or an admin API for them yet, so there
 * are none and the page shows its empty state; the backend's list replaces this.
 */
export async function listAdminIssues(_query: IssueQuery): Promise<IssueList> {
  return { items: [], total: 0, handlers: [] };
}

/** One report with its conversation. None exists until SEC-13 builds the reports, so it is never found. */
export async function getAdminIssue(_issueId: string): Promise<AdminIssue | undefined> {
  return undefined;
}
