import { getTranslations } from "next-intl/server";

import { EmailSettingsForm } from "./email-settings-form";
import { readEmailSettings } from "./email-settings-source";

/** Cài đặt › Email (Figma AD-CS4 to AD-CS7): who delivers email, read from GET /admin/email-settings. */
export async function EmailSettingsPage() {
  const [read, t] = await Promise.all([readEmailSettings(), getTranslations("admin.shell")]);
  return (
    <section aria-labelledby="settings-title" className="flex min-w-0 flex-col gap-4">
      <h2 id="settings-title" className="text-card-title text-foreground">
        {t("pages.settingsEmail.label")}
      </h2>
      <EmailSettingsForm settings={read?.settings ?? null} etag={read?.etag ?? ""} />
    </section>
  );
}
