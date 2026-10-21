import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    <section aria-labelledby="settings-title" className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="settings-title" className="text-card-title text-foreground">
          {shell("pages.settingsCategories.label")}
        </h2>
        <Tooltip>
          <TooltipTrigger render={<span />}>
            <Button disabled>{t("add")}</Button>
          </TooltipTrigger>
          <TooltipContent>{shell("soon")}</TooltipContent>
        </Tooltip>
      </div>
      <CategoriesTable rows={rows} />
    </section>
  );
}
