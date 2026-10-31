import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { PromotionForm } from "@/features/admin-promotions/promotion-form";
import { loadStores } from "@/features/admin-promotions/stores";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { vietnamToday } from "@/features/seller/store-day";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.promotions.form");
  return { title: t("newTitle") };
}

// A new promotion (buyer-discount increment): the form empty, today's hours by default.
export default async function NewPromotionPage() {
  await requireAdmin("/admin/promotions/new");
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);
  const stores = await loadStores(headers);

  return (
    <>
      <AdminTopBar
        crumbs={[
          { label: t("promotions.title"), href: "/admin/promotions" },
          { label: t("promotions.form.newTitle") },
        ]}
      />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <h1 className="text-page-title text-foreground">{t("promotions.form.newTitle")}</h1>
        <PromotionForm promotion={undefined} stores={stores} today={vietnamToday()} />
      </div>
    </>
  );
}
