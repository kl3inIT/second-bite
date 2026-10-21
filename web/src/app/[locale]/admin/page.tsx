import { hasLocale } from "next-intl";

import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

import { adminNav } from "@/features/admin/nav";

// The admin's home opens the menu's first entry until the overview exists (SEC-62 row 5).
export default async function AdminHome({ params }: PageProps<"/[locale]/admin">) {
  const { locale } = await params;
  redirect({
    href: adminNav[0].items[0].href,
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
  });
}
