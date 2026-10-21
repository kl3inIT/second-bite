import type { AuditActor } from "./audit-log";

/**
 * One admin as `GET /admin/admins` is expected to answer it (SEC-75 decision 3: one `admin` role, no
 * permissions, granted and revoked from the CLI or this page).
 */
export type AdminGrant = {
  /** The account that holds the role. */
  accountId: string;
  email: string;
  /** When the role was granted (RFC 3339). */
  grantedAt: string;
  /**
   * Who granted it; none when it was granted from the command line (`secondbite admin grant EMAIL`). A label is
   * none once that account was deleted (SEC-75 decision 6).
   */
  grantedBy: AuditActor | null;
  /** `pending` until the person first signs in with a code after the grant. */
  status: AdminStatus;
};

export type AdminStatus = "active" | "pending";

export type AdminList = { items: AdminGrant[] };

/** Why an admin's role cannot be revoked from this page, or none when it can. */
export type RevokeBlock = "self" | "lastAdmin";

/** Two addresses that name the same person, whatever their case or spaces. */
export function sameEmail(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Whether `admin` can be revoked by the person viewing the list (Saleor `staff_update.py`, SEC-75 decision 3):
 * never themselves, and never the last admin who can still use the admin pages. The backend checks both again
 * under a lock; this only keeps the menu from offering what it would refuse.
 */
export function revokeBlock(
  admin: AdminGrant,
  admins: readonly AdminGrant[],
  viewerEmail: string | undefined,
): RevokeBlock | null {
  if (viewerEmail && sameEmail(admin.email, viewerEmail)) return "self";
  const othersActive = admins.filter(
    (each) => each.status === "active" && each.accountId !== admin.accountId,
  ).length;
  if (admin.status === "active" && othersActive === 0) return "lastAdmin";
  return null;
}

/** A plain address check: something, one "@", then a domain with a dot, and no spaces; at most 254 characters. */
const emailShape = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/**
 * What is wrong with an address typed to add an admin: not an address, or already an admin; none when it can be
 * added.
 */
export function addAdminProblem(
  value: string,
  admins: readonly AdminGrant[],
): "invalid" | "taken" | null {
  const email = value.trim();
  if (email.length > 254 || !emailShape.test(email)) return "invalid";
  if (admins.some((admin) => sameEmail(admin.email, email))) return "taken";
  return null;
}
