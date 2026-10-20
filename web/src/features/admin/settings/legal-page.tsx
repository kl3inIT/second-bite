import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

import { SettingsLayout } from "../ui/settings";
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
    <SettingsLayout
      title={shell("pages.settingsLegal.label")}
      actions={
        <Button disabled title={shell("soon")}>
          {t("newVersion")}
        </Button>
      }
    >
      <LegalDocuments documents={content.documents} draft={content.draft} />
    </SettingsLayout>
  );
}
