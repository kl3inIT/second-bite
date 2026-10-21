import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { AccountsPage } from "@/features/admin/accounts/accounts-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/accounts">) {
  return adminMetadata(params, "accounts");
}

// The accounts (SEC-62, Figma AD-TK1), empty until the identity module lists them for an admin.
export default function AdminAccounts({ searchParams }: PageProps<"/[locale]/admin/accounts">) {
  return (
    <AdminPageGate page="accounts">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <AccountsPage query={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
