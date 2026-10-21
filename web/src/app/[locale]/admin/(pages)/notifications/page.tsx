import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { NotificationsPage } from "@/features/admin/notifications/notifications-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/notifications">) {
  return adminMetadata(params, "notifications");
}

// The notifications sent to groups (SEC-62, Figma AD-MK5), empty until a backend sends them.
export default function AdminNotifications({
  searchParams,
}: PageProps<"/[locale]/admin/notifications">) {
  return (
    <AdminPageGate page="notifications">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <NotificationsPage searchParams={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
