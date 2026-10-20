import "server-only";

import type { AuditAction, AuditQuery } from "./audit-log";

export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  action: AuditAction;
  /** What it was done to, and its page when it has one. */
  target: { label: string; href?: string };
  /** The value before and after; none before when something was created. */
  change: { before?: string; after: string };
};

export type AuditLog = { items: AuditEntry[]; total: number; actors: string[] };

export const auditPageSize = 10;

/**
 * Who did what and when. The modules record who changed a seller's status or a setting last, but keep no log of
 * every change, so there is none; the page shows its empty state until an audit log has a backend.
 */
export async function listAuditLog(_query: AuditQuery): Promise<AuditLog> {
  return { items: [], total: 0, actors: [] };
}
