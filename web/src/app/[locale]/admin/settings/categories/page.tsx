import { Suspense } from "react";

import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { CategoriesPage } from "@/features/admin/settings/categories-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/settings/categories">) {
  return adminMetadata(params, "settingsCategories");
}

export default function AdminCategories() {
  return (
    <AdminPageGate page="settingsCategories">
      <Suspense>
        <CategoriesPage />
      </Suspense>
    </AdminPageGate>
  );
}
