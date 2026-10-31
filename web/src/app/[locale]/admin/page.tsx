import { hasLocale } from "next-intl";
import { connection } from "next/server";

import { isoDay, presetRange, vietnamToday } from "@/features/admin-reports/report-numbers";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// The admin's home opens the report on yesterday, the numbers the sponsor reads each day (SEC-192), until the
// overview exists (SEC-62 row 5).
export default async function AdminHome({ params }: PageProps<"/[locale]/admin">) {
  const { locale } = await params;
  await connection();
  const yesterday = presetRange("yesterday", vietnamToday())!;
  redirect({
    href: `/admin/reports?from=${isoDay(yesterday.from)}&to=${isoDay(yesterday.to)}`,
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
  });
}
