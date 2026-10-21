import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

import { SettingsLayout } from "../ui/settings";
import { readEmailSettings } from "./email-settings-source";
import { Integrations } from "./integrations";

/** Cài đặt › Tích hợp (Figma AD-CD7): email is read from its settings; the others wait for a backend. */
export async function IntegrationsPage() {
  const [email, shell, t] = await Promise.all([
    readEmailSettings(),
    getTranslations("admin.shell"),
    getTranslations("admin.settings.integrations"),
  ]);
  return (
    <SettingsLayout
      title={shell("pages.settingsIntegrations.label")}
      actions={
        <Button variant="outline" disabled title={shell("soon")}>
          {t("addWebhook")}
        </Button>
      }
    >
      <Integrations email={email?.settings ?? null} />
    </SettingsLayout>
  );
}
