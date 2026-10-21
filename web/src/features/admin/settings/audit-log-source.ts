import type { AuditCursor, AuditPage, AuditQuery } from "./audit-log";

/**
 * A page of the audit log, newest first: the first one when the page renders on the server, the next ones when
 * "Tải thêm" is pressed in the browser (`after` the last entry shown). SEC-75 has not built
 * `GET /admin/audit-events?action=&from=&to=&afterAt=&afterId=&size=` yet, so the log is empty; the page shows
 * its empty state.
 */
export async function listAuditLog(_query: AuditQuery, _after?: AuditCursor): Promise<AuditPage> {
  return { items: [], next: null };
}
