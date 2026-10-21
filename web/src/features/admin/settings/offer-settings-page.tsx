import { getTranslations } from "next-intl/server";

import { getOfferSettings } from "@/lib/api/generated";

import { adminRead } from "../session";
import { OfferSettingsForm } from "./offer-settings-form";
import { etagOf } from "./version";

/**
 * Cài đặt › Bài đăng (Figma AD-CS1): the settings every offer follows, read from GET /admin/offer-settings with
 * their version, which a save sends back. The settings layout puts "Cài đặt" and its menu around it.
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
    <section aria-labelledby="settings-title" className="flex min-w-0 flex-col gap-4">
      <h2 id="settings-title" className="text-card-title text-foreground">
        {t("pages.settingsOffers.label")}
      </h2>
      <OfferSettingsForm settings={read.settings} etag={read.etag} />
    </section>
  );
}
