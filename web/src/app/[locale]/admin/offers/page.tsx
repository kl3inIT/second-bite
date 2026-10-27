import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { OffersList } from "@/features/admin-offers/offers-list";
import { loadOfferSearchParams } from "@/features/admin-offers/search-params";
import { vietnamMidnight } from "@/features/audit/search-params";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { listOffersForAdmins, listSellersForAdmins } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.offers");
  return { title: t("title") };
}

// Every store's posts (Figma AD-BD1, SEC-134): a page read on the server for the filters in the address, and
// the stores the "Cửa hàng" filter offers, at most a hundred as the pilot has.
export default async function OffersPage({ searchParams }: PageProps<"/[locale]/admin/offers">) {
  await requireAdmin("/admin/offers");
  const filter = loadOfferSearchParams(await searchParams);
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);

  const [{ data: page }, { data: sellers }] = await Promise.all([
    listOffersForAdmins({
      headers,
      query: {
        status: filter.status ?? undefined,
        q: filter.q || undefined,
        sellerId: filter.store ?? undefined,
        postedSince: filter.from ? vietnamMidnight(filter.from) : undefined,
        postedUntil: filter.from ? vietnamMidnight(filter.to ?? filter.from, 1) : undefined,
        page: filter.page,
        size: filter.size,
      },
    }),
    listSellersForAdmins({ headers, query: { sort: "name", size: 100 } }),
  ]);

  return (
    <>
      <AdminTopBar crumbs={[{ label: t("group.operations") }, { label: t("offers.title") }]} />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <h1 className="text-page-title text-foreground">{t("offers.title")}</h1>
        <OffersList
          offers={page.items}
          total={page.total}
          counts={page.counts}
          stores={(sellers.items ?? []).map((s) => ({ id: s.id, name: s.name }))}
        />
      </div>
    </>
  );
}
