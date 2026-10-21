import { hasLocale } from "next-intl";

import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

import { settingsPages } from "@/features/admin/nav";

// The settings open on their first page.
export default async function SettingsHome({ params }: PageProps<"/[locale]/admin/settings">) {
  const { locale } = await params;
  redirect({
    href: settingsPages[0].href,
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
  });
}
