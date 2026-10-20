import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminGate } from "@/features/admin/admin-gate";

// The admin pages are never indexed, whatever a page sets; they are not in the sitemap either.
export const metadata: Metadata = { robots: { index: false, follow: false } };

// The admin web (SEC-62): the access check, then the shell (sidebar, top bar, toasts) around every admin page.
// Until the session is read the page stays blank, so nothing tells someone who is not an admin that it exists.
export default function AdminLayout({ children }: LayoutProps<"/[locale]/admin">) {
  return (
    <Suspense fallback={<div data-no-footer className="min-h-svh" />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
