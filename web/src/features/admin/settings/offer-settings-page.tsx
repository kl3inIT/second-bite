import { getTranslations } from "next-intl/server";

import { getOfferSettings } from "@/lib/api/generated";

import { adminRead } from "../session";
import { SettingsLayout } from "../ui/settings";
import { OfferSettingsForm } from "./offer-settings-form";
import { etagOf } from "./version";

/**
 * Cài đặt › Bài đăng (Figma AD-CS1): the settings every offer follows, read from GET /admin/offer-settings with
 * their version, which a save sends back.
 */
export async function OfferSettingsPage() {
  const [read, t] = await Promise.all([
    adminRead(async (headers) => {
      const { data, response } = await getOfferSettings({ headers });
      return { data: { settings: data, etag: etagOf(response) } };
    }),
    getTranslations("admin.shell"),
  ]);
  return (
    <SettingsLayout title={t("pages.settingsOffers.label")}>
      <OfferSettingsForm settings={read.settings} etag={read.etag} />
    </SettingsLayout>
  );
}
