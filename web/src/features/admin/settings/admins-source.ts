import "server-only";

import { type AccountBody, listAdmins } from "@/lib/api/generated";

import { adminRead } from "../session";

/** The platform's admins, by address, from `GET /admin/admins` (SEC-75). */
export async function readAdmins(): Promise<AccountBody[]> {
  const { admins } = await adminRead((headers) => listAdmins({ headers }));
  return admins ?? [];
}
