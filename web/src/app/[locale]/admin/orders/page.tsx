import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { OrdersList } from "@/features/admin-orders/orders-list";
import { loadOrderSearchParams, statusesOf } from "@/features/admin-orders/search-params";
import { vietnamMidnight } from "@/features/audit/search-params";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { listOrdersForAdmins, listSellersForAdmins } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.orders");
  return { title: t("title") };
}

// Every store's orders (Figma AD-DH1, SEC-135): a page read on the server for the filters in the address, and
// the stores the "Cửa hàng" filter offers, at most a hundred as the pilot has.
export default async function OrdersPage({ searchParams }: PageProps<"/[locale]/admin/orders">) {
  await requireAdmin("/admin/orders");
  const filter = loadOrderSearchParams(await searchParams);
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);

  const [{ data: page }, { data: sellers }] = await Promise.all([
    listOrdersForAdmins({
      headers,
      query: {
        status: filter.state ? statusesOf[filter.state] : undefined,
        q: filter.q || undefined,
        sellerId: filter.store ?? undefined,
        collectSince: filter.from ? vietnamMidnight(filter.from) : undefined,
        collectUntil: filter.from ? vietnamMidnight(filter.to ?? filter.from, 1) : undefined,
        page: filter.page,
        size: filter.size,
      },
    }),
    listSellersForAdmins({ headers, query: { sort: "name", size: 100 } }),
  ]);

  return (
    <>
      <AdminTopBar crumbs={[{ label: t("group.operations") }, { label: t("orders.title") }]} />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <h1 className="text-page-title text-foreground">{t("orders.title")}</h1>
        <OrdersList
          orders={page.items}
          total={page.total}
          counts={page.counts}
          stores={(sellers.items ?? []).map((s) => ({ id: s.id, name: s.name }))}
        />
      </div>
    </>
  );
}
