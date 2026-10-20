import "server-only";

import type { AdminRole, AdminStatus } from "./admin-rows";

export type AdminRow = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  /** When they last signed in; none before their first time. */
  lastSignInAt?: string;
  status: AdminStatus;
  /** The admin looking at the list. */
  you: boolean;
};

/**
 * The platform's admins. Identity keeps only the `admin` role, granted from the command line, and no list of who
 * holds it, so there are none here; the page shows its empty state until admins and their roles have a backend.
 */
export async function listAdmins(): Promise<AdminRow[]> {
  return [];
}
