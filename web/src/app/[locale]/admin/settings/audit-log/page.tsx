import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { AuditLogPage } from "@/features/admin/settings/audit-log-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/settings/audit-log">) {
  return adminMetadata(params, "settingsAuditLog");
}

export default function AdminAuditLog({
  searchParams,
}: PageProps<"/[locale]/admin/settings/audit-log">) {
  return (
    <AdminPageGate page="settingsAuditLog">
      <Suspense>
        <AuditLogPage searchParams={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
