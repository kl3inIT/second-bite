import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { IntegrationsPage } from "@/features/admin/settings/integrations-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/settings/integrations">) {
  return adminMetadata(params, "settingsIntegrations");
}

export default function AdminIntegrations() {
  return (
    <AdminPageGate page="settingsIntegrations">
      <Suspense>
        <IntegrationsPage />
      </Suspense>
    </AdminPageGate>
  );
}
