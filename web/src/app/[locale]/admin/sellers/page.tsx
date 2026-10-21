import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { loadProvinces } from "@/features/admin-sellers/provinces";
import { SellersList } from "@/features/admin-sellers/sellers-list";
import { loadSellerSearchParams } from "@/features/admin-sellers/search-params";
import { vietnamMidnight } from "@/features/audit/search-params";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { listSellersForAdmins } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.sellers");
  return { title: t("title") };
}

// The stores (Figma AD-Q1, SEC-62): a page read on the server for the filters in the address.
export default async function SellersPage({ searchParams }: PageProps<"/[locale]/admin/sellers">) {
  await requireAdmin("/admin/sellers");
  const filter = loadSellerSearchParams(await searchParams);
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);

  const provincesRead = loadProvinces();
  const { data: page } = await listSellersForAdmins({
    headers,
    query: {
      status: filter.status ? [filter.status] : undefined,
      q: filter.q || undefined,
      changedSince: filter.from ? vietnamMidnight(filter.from) : undefined,
      changedUntil: filter.from ? vietnamMidnight(filter.to ?? filter.from, 1) : undefined,
      sort: filter.sort ?? undefined,
      page: filter.page,
      size: filter.size,
    },
  });

  return (
    <>
      <AdminTopBar crumbs={[{ label: t("group.operations") }, { label: t("sellers.title") }]} />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <h1 className="text-page-title text-foreground">{t("sellers.title")}</h1>
        <SellersList
          sellers={page.items ?? []}
          total={page.total}
          counts={page.counts}
          days={page.days ?? []}
          provinces={await provincesRead}
        />
      </div>
    </>
  );
}
