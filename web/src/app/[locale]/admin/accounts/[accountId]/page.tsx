import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { AccountDetailPage } from "@/features/admin/accounts/accounts-page";
import { getAdminAccount } from "@/features/admin/accounts/accounts-source";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/admin/accounts/[accountId]">) {
  const { accountId } = await params;
  const account = await getAdminAccount(accountId);
  return adminMetadata(params, { title: account?.name ?? accountId });
}

// One account (SEC-62, Figma AD-TK2 to AD-TK4); not found until the identity module lists accounts for an admin.
export default function AdminAccount({
  params,
  searchParams,
}: PageProps<"/[locale]/admin/accounts/[accountId]">) {
  return (
    <AdminPageGate page="accountDetail">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <AccountDetailPage params={params} query={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
