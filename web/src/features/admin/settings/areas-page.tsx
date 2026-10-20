import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

import { SettingsLayout } from "../ui/settings";
import { listAreas } from "./areas-source";
import { AreasTable } from "./areas-table";

/** Cài đặt › Khu vực (Figma AD-CD2). Empty until areas have a backend. */
export async function AreasPage() {
  const [rows, shell, t] = await Promise.all([
    listAreas(),
    getTranslations("admin.shell"),
    getTranslations("admin.settings.areas"),
  ]);
  return (
    <SettingsLayout
      title={shell("pages.settingsAreas.label")}
      actions={
        <Button disabled title={shell("soon")}>
          {t("add")}
        </Button>
      }
    >
      <AreasTable rows={rows} />
    </SettingsLayout>
  );
}
