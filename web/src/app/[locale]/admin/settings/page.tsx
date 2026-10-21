import { redirect } from "next/navigation";

import { settingsPages } from "@/features/admin/nav";

// The settings open on their first page.
export default async function SettingsHome({ params }: PageProps<"/[locale]/admin/settings">) {
  const { locale } = await params;
  redirect(`/${locale}${settingsPages[0].href}`);
}
