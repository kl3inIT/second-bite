import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { ComposeEditor } from "@/features/admin/notifications/compose";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/notifications/new">) {
  return adminMetadata(params, "notificationsCompose");
}

// Writing a notification to a group (SEC-62, Figma AD-MK6). It cannot be sent until a backend sends to groups.
// The composer starts from today's time, so it renders at request time, inside Suspense.
export default function AdminNotificationCompose() {
  return (
    <AdminPageGate page="notificationsCompose">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <ComposeEditor />
      </Suspense>
    </AdminPageGate>
  );
}
