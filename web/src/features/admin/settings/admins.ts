import type { AccountBody } from "@/lib/api/generated";

/** Why an admin's role cannot be revoked from this page, or none when it can. */
export type RevokeBlock = "self" | "lastAdmin";

/** Two addresses that name the same person, whatever their case or spaces. */
export function sameEmail(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Whether `admin` can be revoked by the person viewing the list (Saleor `staff_update.py`, SEC-75 decision 3):
 * never themselves, and never the last admin. The backend checks both again under a lock
 * (`IDENTITY_ADMIN_SELF`, `IDENTITY_LAST_ADMIN`); this only keeps the menu from offering what it would refuse.
 */
export function revokeBlock(
  admin: AccountBody,
  admins: readonly AccountBody[],
  viewerEmail: string | undefined,
): RevokeBlock | null {
  if (viewerEmail && sameEmail(admin.email, viewerEmail)) return "self";
  if (!admins.some((each) => each.id !== admin.id)) return "lastAdmin";
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
  admins: readonly AccountBody[],
): "invalid" | "taken" | null {
  const email = value.trim();
  if (email.length > 254 || !emailShape.test(email)) return "invalid";
  if (admins.some((admin) => sameEmail(admin.email, email))) return "taken";
  return null;
}

/** The refusals of granting and revoking that the page words itself; any other failure says to try again. */
const refusals = {
  IDENTITY_ADMIN_SELF: "self",
  IDENTITY_LAST_ADMIN: "lastAdmin",
  IDENTITY_ADDRESS_UNPROVEN: "unproven",
  IDENTITY_EMAIL_INVALID: "invalid",
} as const;

export type AdminRefusal = (typeof refusals)[keyof typeof refusals] | "failed";

/** The toast's key for a refused grant or revoke, from the backend's code. */
export function adminRefusal(code: string | undefined): AdminRefusal {
  return (code && refusals[code as keyof typeof refusals]) || "failed";
}
