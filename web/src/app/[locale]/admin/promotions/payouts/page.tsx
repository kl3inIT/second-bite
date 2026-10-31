import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { PayoutsList } from "@/features/admin-promotions/payouts-list";
import { loadPayoutSearchParams } from "@/features/admin-promotions/search-params";
import { mondayOf } from "@/features/admin-promotions/week";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { readDay, vietnamToday } from "@/features/seller/store-day";
import { listPayouts, listPromotions } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.payouts");
  return { title: t("title") };
}

// What Second Bite pays the stores back (buyer-discount increment), a week at a time, this week's by default.
export default async function PayoutsPage({
  searchParams,
}: PageProps<"/[locale]/admin/promotions/payouts">) {
  await requireAdmin("/admin/promotions/payouts");
  const filter = loadPayoutSearchParams(await searchParams);
  const week = mondayOf(readDay(filter.week ?? undefined, vietnamToday()));
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);

  const [{ data: owed }, { data: page }] = await Promise.all([
    listPayouts({
      headers,
      query: { weekStart: week, promotionId: filter.promotion ?? undefined },
    }),
    listPromotions({ headers, query: { size: 100 } }),
  ]);

  return (
    <>
      <AdminTopBar
        crumbs={[
          { label: t("promotions.title"), href: "/admin/promotions" },
          { label: t("payouts.title") },
        ]}
      />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <h1 className="text-page-title text-foreground">{t("payouts.title")}</h1>
        <PayoutsList
          payouts={owed.payouts}
          week={week}
          promotions={page.items.map((p) => ({ id: p.id, name: p.name }))}
        />
      </div>
    </>
  );
}
