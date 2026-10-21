import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { ContentPage } from "@/features/admin/content/content-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/content">) {
  return adminMetadata(params, "content");
}

// Banners and featured collections (SEC-62, Figma AD-MK3), empty until a backend keeps them.
export default function AdminContent({ searchParams }: PageProps<"/[locale]/admin/content">) {
  return (
    <AdminPageGate page="content">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <ContentPage searchParams={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
