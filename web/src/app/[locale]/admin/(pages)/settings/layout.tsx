import { getTranslations } from "next-intl/server";

import { SettingsNav } from "@/features/admin/settings-nav";

// Every SEC-62 settings page, as SEC-75's email settings lay theirs out: "Cài đặt" over the settings menu on the
// left and the open page on the right, the menu above it on a phone. A page that is not released shows its
// coming-soon screen here, beside the menu.
export default async function AdminSettingsLayout({
  children,
}: LayoutProps<"/[locale]/admin/settings">) {
  const t = await getTranslations("Admin");
  return (
    <>
      <h1 className="text-page-title text-foreground">{t("settings.title")}</h1>
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <SettingsNav />
        <div className="flex min-w-0 flex-1 flex-col gap-4 md:max-w-4xl">{children}</div>
      </div>
    </>
  );
}
