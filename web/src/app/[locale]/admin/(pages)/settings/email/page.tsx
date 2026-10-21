import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { EmailSettingsPage } from "@/features/admin/settings/email-settings-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/settings/email">) {
  return adminMetadata(params, "settingsEmail");
}

export default function AdminEmailSettings() {
  return (
    <AdminPageGate page="settingsEmail">
      <Suspense>
        <EmailSettingsPage />
      </Suspense>
    </AdminPageGate>
  );
}
