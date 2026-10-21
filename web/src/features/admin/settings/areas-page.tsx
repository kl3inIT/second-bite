import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    <section aria-labelledby="settings-title" className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="settings-title" className="text-card-title text-foreground">
          {shell("pages.settingsAreas.label")}
        </h2>
        <Tooltip>
          <TooltipTrigger render={<span />}>
            <Button disabled>{t("add")}</Button>
          </TooltipTrigger>
          <TooltipContent>{shell("soon")}</TooltipContent>
        </Tooltip>
      </div>
      <AreasTable rows={rows} />
    </section>
  );
}
