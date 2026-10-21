import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminsList } from "@/features/accounts/admins-list";
import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { SettingsNav } from "@/features/admin/settings-nav";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { listAdmins } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.admins");
  return { title: t("title") };
}

// The admins (Settings › Quản trị viên, SEC-75): read on the server, granted and revoked in the page.
export default async function AdminsPage() {
  const me = await requireAdmin("/admin/settings/admins");
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);
  const { data } = await listAdmins({ headers });

  return (
    <>
      <AdminTopBar
        crumbs={[
          { label: t("settings.title"), href: "/admin/settings" },
          { label: t("admins.title") },
        ]}
      />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <h1 className="text-page-title text-foreground">{t("settings.title")}</h1>
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <SettingsNav />
          <div className="min-w-0 flex-1 md:max-w-4xl">
            <AdminsList admins={data.admins ?? []} myId={me.id} />
          </div>
        </div>
      </div>
    </>
  );
}
