"use client";

import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AdminCrumbsProvider } from "./admin-crumbs";
import { AdminSidebar } from "./admin-sidebar";
import { AdminToaster } from "./admin-toast";
import { AdminTopBar } from "./admin-top-bar";

// The frame of every admin page (Figma AD-Q1, AD-Q2): the sidebar on the left, then the top bar over the page
// on white, 24px by 32px around it and 20px between its blocks; the toasts at the bottom right.
// `data-no-footer` keeps the customer site's footer out.
export function AdminShell({
  account,
  sidebarOpen,
  children,
}: {
  account: { email: string; displayName: string };
  sidebarOpen: boolean;
  children: ReactNode;
}) {
  return (
    <AdminToaster>
      <AdminCrumbsProvider>
        <SidebarProvider defaultOpen={sidebarOpen} data-no-footer>
          <AdminSidebar account={account} />
          {/* shadcn's inset is the page's <main>. */}
          <SidebarInset className="min-w-0">
            <div className="flex flex-1 flex-col bg-card">
              <AdminTopBar />
              <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AdminCrumbsProvider>
    </AdminToaster>
  );
}
