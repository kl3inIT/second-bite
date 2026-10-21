import { getTranslations } from "next-intl/server";

import { SettingsNav } from "@/features/admin/settings/settings-nav";

// Every settings page (Figma AD-CS1): "Cài đặt" over the settings menu on the left and the open page on the right,
// the menu above it on a phone. A page that is not released shows its coming-soon screen here, beside the menu.
export default async function AdminSettingsLayout({
  children,
}: LayoutProps<"/[locale]/admin/settings">) {
  const t = await getTranslations("admin.shell");
  return (
    <>
      <h1 className="text-page-title text-foreground">{t("pages.settings.label")}</h1>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <SettingsNav />
        <div className="flex min-w-0 flex-1 flex-col gap-4">{children}</div>
      </div>
    </>
  );
}
