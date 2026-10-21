import { getTranslations } from "next-intl/server";

import { SettingsLayout } from "../ui/settings";
import { EmailSettingsForm } from "./email-settings-form";
import { readEmailSettings } from "./email-settings-source";

/** Cài đặt › Email (Figma AD-CS4 to AD-CS7): who delivers email, read from GET /admin/email-settings. */
export async function EmailSettingsPage() {
  const [read, t] = await Promise.all([readEmailSettings(), getTranslations("admin.shell")]);
  return (
    <SettingsLayout title={t("pages.settingsEmail.label")}>
      <EmailSettingsForm settings={read?.settings ?? null} etag={read?.etag ?? ""} />
    </SettingsLayout>
  );
}
