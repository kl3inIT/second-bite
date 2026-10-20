import { getLocale } from "next-intl/server";
import { Suspense } from "react";

import { adminHref } from "@/features/admin/pages";
import { getCurrentAccount } from "@/features/identity/current-account";
import { redirect } from "@/i18n/navigation";

// /admin opens the overview. Only an admin is sent on: the layout deals with everyone else, so the redirect
// does not tell them the admin exists.
export default function AdminHome() {
  return (
    <Suspense>
      <ToOverview />
    </Suspense>
  );
}

async function ToOverview() {
  const account = await getCurrentAccount();
  if (account?.role === "admin") {
    redirect({ href: adminHref("overview"), locale: await getLocale() });
  }
  return null;
}
