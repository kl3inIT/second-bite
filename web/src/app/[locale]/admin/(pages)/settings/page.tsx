import { getLocale } from "next-intl/server";
import { Suspense } from "react";

import { adminHref } from "@/features/admin/pages";
import { getCurrentAccount } from "@/features/identity/current-account";
import { redirect } from "@/i18n/navigation";

// /admin/settings opens its first page, the offer settings (Figma AD-CS1). As /admin does, only an admin is sent
// on: the layout deals with everyone else, so the redirect does not tell them the admin exists.
export default function AdminSettings() {
  return (
    <Suspense>
      <ToOfferSettings />
    </Suspense>
  );
}

async function ToOfferSettings() {
  const account = await getCurrentAccount();
  if (account?.role === "admin") {
    redirect({ href: adminHref("settingsOffers"), locale: await getLocale() });
  }
  return null;
}
