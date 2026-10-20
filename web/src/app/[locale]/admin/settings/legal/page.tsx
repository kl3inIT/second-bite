import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { LegalPage } from "@/features/admin/settings/legal-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/settings/legal">) {
  return adminMetadata(params, "settingsLegal");
}

export default function AdminLegal() {
  return (
    <AdminPageGate page="settingsLegal">
      <Suspense>
        <LegalPage />
      </Suspense>
    </AdminPageGate>
  );
}
