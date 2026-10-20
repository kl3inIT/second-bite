import "server-only";

import type { AccountQuery, AccountTab, AdminAccount, AdminAccountRow } from "./account";

export type AccountList = {
  items: AdminAccountRow[];
  /** How many accounts match, for the pagination. */
  total: number;
  /** How many accounts each tab holds, once the backend counts them. */
  counts?: Record<AccountTab, number>;
};

/**
 * The accounts an admin looks up. The identity module has no admin list of accounts yet, so there are none and
 * the page shows its empty state; the backend's list replaces this.
 */
export async function listAdminAccounts(_query: AccountQuery): Promise<AccountList> {
  return { items: [], total: 0 };
}

/** One account with its orders, stores and reports. Without the admin API none is found. */
export async function getAdminAccount(_accountId: string): Promise<AdminAccount | undefined> {
  return undefined;
}
