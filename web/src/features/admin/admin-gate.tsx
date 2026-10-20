import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import { getCurrentAccount } from "@/features/identity/current-account";

import { AdminShell } from "./admin-shell";
import { SignInRedirect } from "./sign-in-redirect";

/** The cookie shadcn's sidebar keeps its open or collapsed state in (components/ui/sidebar.tsx). */
const sidebarCookie = "sidebar_state";

/**
 * Who may see the admin pages (docs: admin-web-flow › Quyền truy cập): someone not signed in goes to sign in and
 * comes back; someone signed in who is not an admin gets the customer's not-found page, so nothing says the
 * admin exists; an admin gets the shell. The backend still refuses every admin call to a non-admin
 * (`PLATFORM_ADMIN_REQUIRED`), and admin reads go through `adminRead`, which does the same. It reads the
 * request, so the layout renders it inside Suspense.
 */
export async function AdminGate({ children }: { children: ReactNode }) {
  const [account, store] = await Promise.all([getCurrentAccount(), cookies()]);
  if (!account) return <SignInRedirect />;
  if (account.role !== "admin") notFound();

  return (
    // The admin's own catalogs reach the browser only here (the root layout leaves them out).
    <NextIntlClientProvider>
      <AdminShell
        account={{ email: account.email, displayName: account.displayName }}
        sidebarOpen={store.get(sidebarCookie)?.value !== "false"}
      >
        {children}
      </AdminShell>
    </NextIntlClientProvider>
  );
}
