import { Suspense } from "react";

import { AdminGate } from "@/features/admin/admin-gate";

// The admin web (SEC-62): the access check, then the shell (sidebar, top bar, toasts) around every admin page.
// No admin address is indexed: next.config.ts sends X-Robots-Tag for all of them, and each page's metadata says
// noindex too (adminMetadata).
// Until the session is read the page stays blank, so nothing tells someone who is not an admin that it exists.
export default function AdminLayout({ children }: LayoutProps<"/[locale]/admin">) {
  return (
    <Suspense fallback={<div data-no-footer className="min-h-svh" />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
