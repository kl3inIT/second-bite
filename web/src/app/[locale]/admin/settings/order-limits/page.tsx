import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { OrderLimitsForm } from "@/features/admin/order-limits-form";
import { SettingsNav } from "@/features/admin/settings-nav";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { getOfferSettings, getOrderSettings } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.orderLimits");
  return { title: t("title") };
}

// The limits on what one person holds (SEC-158, Figma L7), a page of the settings: the offer settings' cap per
// order and the order settings, each read with its version, changed in one form.
export default async function OrderLimitsPage() {
  await requireAdmin("/admin/settings/order-limits");
  const headers = await sessionHeaders();
  const [t, offer, order] = await Promise.all([
    getTranslations("Admin"),
    getOfferSettings({ headers }),
    getOrderSettings({ headers }),
  ]);
  const { updatedAt, updatedBy: _by, ...offerBody } = offer.data;
  const offerVersion = offer.response.headers.get("etag") ?? "";
  const orderVersion = order.response.headers.get("etag") ?? "";

  return (
    <>
      <AdminTopBar
        crumbs={[
          { label: t("settings.title"), href: "/admin/settings" },
          { label: t("orderLimits.title") },
        ]}
      />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <h1 className="text-page-title text-foreground">{t("settings.title")}</h1>
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <SettingsNav />
          <div className="min-w-0 flex-1 md:max-w-4xl">
            {/* New versions of the settings start the form over from them. */}
            <OrderLimitsForm
              key={`${offerVersion}:${orderVersion}`}
              offer={{ body: offerBody, version: offerVersion, updatedAt }}
              order={order.data}
              orderVersion={orderVersion}
            />
          </div>
        </div>
      </div>
    </>
  );
}
