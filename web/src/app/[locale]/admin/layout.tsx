import type { Metadata } from "next";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/admin-sidebar";
import { getCurrentAccount } from "@/features/identity/current-account";
import { clientMessages } from "@/i18n/client-messages";

// No admin page is for search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

// The admin's frame (SEC-75 › Shell): the sidebar beside the page, for an admin; anyone else gets the page
// alone, which refuses them itself (`requireAdmin`). It has no site footer and no bottom bar. The account
// and the sidebar's state are read from the request, so the frame renders inside Suspense. Its client components
// read the Admin messages, which the site's layout leaves out of every other page (SEC-166).
export default async function AdminLayout({ children }: LayoutProps<"/[locale]/admin">) {
  return (
    <NextIntlClientProvider messages={await clientMessages("admin")}>
      <div data-no-footer className="flex flex-1 flex-col">
        <Suspense>
          <AdminFrame>{children}</AdminFrame>
        </Suspense>
      </div>
    </NextIntlClientProvider>
  );
}

async function AdminFrame({ children }: { children: React.ReactNode }) {
  const [account, jar] = await Promise.all([getCurrentAccount(), cookies()]);
  if (account?.role !== "admin") return children;

  return (
    <SidebarProvider
      defaultOpen={jar.get("sidebar_state")?.value !== "false"}
      // Collapsed, the rail keeps 44 px targets inside its padding (Figma AD-Q2).
      style={{ "--sidebar-width-icon": "4.5rem" } as React.CSSProperties}
    >
      <SkipLink />
      <AdminSidebar email={account.email} />
      <SidebarInset id="admin-main" className="min-w-0">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

// Past the sidebar to the page, the frame's <main>.
async function SkipLink() {
  const t = await getTranslations("Admin");
  return (
    <a
      href="#admin-main"
      className="sr-only z-50 rounded-md bg-primary px-4 py-3 text-button text-primary-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
    >
      {t("skip")}
    </a>
  );
}
