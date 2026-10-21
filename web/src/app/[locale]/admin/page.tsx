import { redirect } from "next/navigation";

import { adminNav } from "@/features/admin/nav";

// The admin's home opens the menu's first entry until the overview exists (SEC-62 row 5).
export default async function AdminHome({ params }: PageProps<"/[locale]/admin">) {
  const { locale } = await params;
  redirect(`/${locale}${adminNav[0].items[0].href}`);
}
