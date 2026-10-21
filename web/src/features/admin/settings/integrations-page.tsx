import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ApiError } from "@/lib/api/client";
import { type EmailSettingsBody, getEmailSettings } from "@/lib/api/generated";

import { adminRead } from "../session";

import { Integrations } from "./integrations";

/** Who delivers email, or nothing when no provider is saved yet (NOTIFICATION_EMAIL_NOT_CONFIGURED). */
async function readEmailSettings(): Promise<EmailSettingsBody | null> {
  try {
    return await adminRead(async (headers) => await getEmailSettings({ headers }));
  } catch (error) {
    if (error instanceof ApiError && error.code === "NOTIFICATION_EMAIL_NOT_CONFIGURED")
      return null;
    throw error;
  }
}

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
      <Integrations email={email} />
    </section>
  );
}
