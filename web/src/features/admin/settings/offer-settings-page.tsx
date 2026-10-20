import { getTranslations } from "next-intl/server";

import { getOfferSettings } from "@/lib/api/generated";

import { adminRead } from "../session";
import { SettingsLayout } from "../ui/settings";
import { OfferSettingsForm } from "./offer-settings-form";

/** Cài đặt › Bài đăng (Figma AD-CS1): the settings every offer follows, read from GET /admin/offer-settings. */
export async function OfferSettingsPage() {
  const [settings, t] = await Promise.all([
    adminRead((headers) => getOfferSettings({ headers })),
    getTranslations("admin.shell"),
  ]);
  return (
    <SettingsLayout title={t("pages.settingsOffers.label")}>
      <OfferSettingsForm settings={settings} />
    </SettingsLayout>
  );
}
