import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { AdminsPage } from "@/features/admin/settings/admins-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/settings/admins">) {
  return adminMetadata(params, "settingsAdmins");
}

export default function AdminAdmins() {
  return (
    <AdminPageGate page="settingsAdmins">
      <Suspense>
        <AdminsPage />
      </Suspense>
    </AdminPageGate>
  );
}
