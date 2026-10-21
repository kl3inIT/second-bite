import { NextIntlClientProvider } from "next-intl";

import { AdminPageFrame } from "@/features/admin/admin-shell";
import { requireAdmin } from "@/features/identity/current-account";

// The SEC-62 pages (overview, stores, settings and the pages behind their flags) inside SEC-75's admin layout:
// only an admin gets past requireAdmin; the admin's own catalogs reach the browser here, since the root layout
// leaves them out; and each page sits under the top bar its address names.
export default async function AdminPagesLayout({ children }: LayoutProps<"/[locale]/admin">) {
  await requireAdmin("/admin");
  return (
    <NextIntlClientProvider>
      <AdminPageFrame>{children}</AdminPageFrame>
    </NextIntlClientProvider>
  );
}
