import "server-only";

import type { AdminList } from "./admins";

/**
 * The platform's admins. SEC-75 has not built `GET /admin/admins` yet (identity keeps the `admin` role, granted
 * from the command line, with no list of who holds it), so there are none; the page shows its empty state.
 */
export async function listAdmins(): Promise<AdminList> {
  return { items: [] };
}
