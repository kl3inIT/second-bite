import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { LegalDocuments } from "./legal-documents";
import { listLegalDocuments } from "./legal-source";

/** Cài đặt › Nội dung pháp lý (Figma AD-CD6). Empty until legal content has a backend. */
export async function LegalPage() {
  const [content, shell, t] = await Promise.all([
    listLegalDocuments(),
    getTranslations("admin.shell"),
    getTranslations("admin.settings.legal"),
  ]);
  return (
    <section aria-labelledby="settings-title" className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="settings-title" className="text-card-title text-foreground">
          {shell("pages.settingsLegal.label")}
        </h2>
        <Tooltip>
          <TooltipTrigger render={<span />}>
            <Button disabled>{t("newVersion")}</Button>
          </TooltipTrigger>
          <TooltipContent>{shell("soon")}</TooltipContent>
        </Tooltip>
      </div>
      <LegalDocuments documents={content.documents} draft={content.draft} />
    </section>
  );
}
