import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AccountsList } from "@/features/accounts/accounts-list";
import { GrantAdmin } from "@/features/accounts/grant-admin";
import { loadAccountSearchParams } from "@/features/accounts/search-params";
import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { listAccounts, listAdmins, listMembershipsForAdmins } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.accounts");
  return { title: t("title") };
}

// The accounts (Figma AD-TK1, SEC-75): a page read on the server for the filters in the address, then the
// stores of the accounts on it, which the seller module answers, and the admins, whom a row's menu may revoke.
export default async function AccountsPage({
  searchParams,
}: PageProps<"/[locale]/admin/accounts">) {
  const me = await requireAdmin("/admin/accounts");
  const filter = loadAccountSearchParams(await searchParams);
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);

  const [{ data: page }, { data: admins }] = await Promise.all([
    listAccounts({
      headers,
      query: {
        role: filter.role ?? undefined,
        q: filter.q || undefined,
        sort: filter.sort ?? undefined,
        page: filter.page,
        size: filter.size,
      },
    }),
    listAdmins({ headers }),
  ]);
  const accounts = page.items ?? [];
  const memberships =
    accounts.length === 0
      ? []
      : ((
          await listMembershipsForAdmins({
            headers,
            query: { accountId: accounts.map((account) => account.id) },
          })
        ).data.memberships ?? []);

  return (
    <>
      <AdminTopBar crumbs={[{ label: t("group.users") }, { label: t("accounts.title") }]} />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-page-title text-foreground">{t("accounts.title")}</h1>
          <GrantAdmin />
        </div>
        <AccountsList
          accounts={accounts}
          total={page.total}
          counts={page.counts}
          memberships={memberships}
          myId={me.id}
          adminCount={admins.admins?.length ?? 0}
        />
      </div>
    </>
  );
}
