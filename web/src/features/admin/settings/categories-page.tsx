import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

import { SettingsLayout } from "../ui/settings";
import { listCategories } from "./categories-source";
import { CategoriesTable } from "./categories-table";

/** Cài đặt › Danh mục (Figma AD-CD1). Empty until categories have a backend. */
export async function CategoriesPage() {
  const [rows, shell, t] = await Promise.all([
    listCategories(),
    getTranslations("admin.shell"),
    getTranslations("admin.settings.categories"),
  ]);
  return (
    <SettingsLayout
      title={shell("pages.settingsCategories.label")}
      actions={
        <Button disabled title={shell("soon")}>
          {t("add")}
        </Button>
      }
    >
      <CategoriesTable rows={rows} />
    </SettingsLayout>
  );
}
