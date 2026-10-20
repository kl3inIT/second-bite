import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { OfferSettingsPage } from "@/features/admin/settings/offer-settings-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/settings/offers">) {
  return adminMetadata(params, "settingsOffers");
}

export default function AdminOfferSettings() {
  return (
    <AdminPageGate page="settingsOffers">
      <Suspense>
        <OfferSettingsPage />
      </Suspense>
    </AdminPageGate>
  );
}
