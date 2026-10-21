import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AccountDetail } from "@/features/accounts/account-detail";
import { nameOf } from "@/features/accounts/account-parts";
import { RoleAction } from "@/features/accounts/role-action";
import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { ApiError } from "@/lib/api/client";
import {
  getAccountForAdmins,
  getAccountOrderHistory,
  listAdmins,
  listMembershipsForAdmins,
} from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.accounts");
  return { title: t("title") };
}

/** The account, or the admin's not-found page when there is none or the address names none. */
async function readAccount(accountId: string, headers: Awaited<ReturnType<typeof sessionHeaders>>) {
  try {
    return (await getAccountForAdmins({ headers, path: { accountId } })).data;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound();
    throw error;
  }
}

// One account (Figma AD-TK2, SEC-75): read from identity, then what it ordered and the stores it belongs to.
export default async function AccountPage({
  params,
}: PageProps<"/[locale]/admin/accounts/[accountId]">) {
  const { accountId } = await params;
  const me = await requireAdmin(`/admin/accounts/${accountId}`);
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);

  const account = await readAccount(accountId, headers);
  const [{ data: history }, { data: memberships }, { data: admins }] = await Promise.all([
    getAccountOrderHistory({ headers, path: { accountId } }),
    listMembershipsForAdmins({ headers, query: { accountId: [accountId] } }),
    listAdmins({ headers }),
  ]);

  return (
    <>
      <AdminTopBar
        crumbs={[
          { label: t("group.users") },
          { label: t("accounts.title"), href: "/admin/accounts" },
          { label: nameOf(account) },
        ]}
      />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <AccountDetail
          account={account}
          history={history}
          memberships={memberships.memberships ?? []}
          action={
            <RoleAction account={account} myId={me.id} adminCount={admins.admins?.length ?? 0} />
          }
        />
      </div>
    </>
  );
}
