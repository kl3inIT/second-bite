import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { AreasPage } from "@/features/admin/settings/areas-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/settings/areas">) {
  return adminMetadata(params, "settingsAreas");
}

export default function AdminAreas() {
  return (
    <AdminPageGate page="settingsAreas">
      <Suspense>
        <AreasPage />
      </Suspense>
    </AdminPageGate>
  );
}
