import { notFound } from "next/navigation";

import { readAccountQuery, readDetailTab } from "./account";
import { AccountDetail } from "./account-detail";
import { AccountsList } from "./accounts-list";
import { getAdminAccount, listAdminAccounts } from "./accounts-source";

type Query = Promise<Record<string, string | string[] | undefined>>;

/** The accounts for the address's tab and filters (Figma AD-TK1). It reads the request, so it renders in Suspense. */
export async function AccountsPage({ query: pendingQuery }: { query: Query }) {
  const query = readAccountQuery(await pendingQuery);
  const list = await listAdminAccounts(query);
  return <AccountsList query={query} rows={list.items} total={list.total} counts={list.counts} />;
}

/** One account on its tab, or the admin's not-found page, which keeps the shell (AD-TT5). */
export async function AccountDetailPage({
  accountId,
  query,
}: {
  accountId: Promise<string>;
  query: Query;
}) {
  const [account, params] = await Promise.all([accountId.then(getAdminAccount), query]);
  if (!account) notFound();
  return <AccountDetail account={account} tab={readDetailTab(params.tab)} />;
}
