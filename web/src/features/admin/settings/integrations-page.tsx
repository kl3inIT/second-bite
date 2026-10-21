import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    <section aria-labelledby="settings-title" className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="settings-title" className="text-card-title text-foreground">
          {shell("pages.settingsIntegrations.label")}
        </h2>
        <Tooltip>
          <TooltipTrigger render={<span />}>
            <Button variant="outline" disabled>
              {t("addWebhook")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{shell("soon")}</TooltipContent>
        </Tooltip>
      </div>
      <Integrations email={email?.settings ?? null} />
    </section>
  );
}
