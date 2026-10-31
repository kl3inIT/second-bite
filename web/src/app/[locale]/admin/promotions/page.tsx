import { PlusIcon, WalletIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { PromotionsList } from "@/features/admin-promotions/promotions-list";
import { loadPromotionSearchParams } from "@/features/admin-promotions/search-params";
import { loadStores } from "@/features/admin-promotions/stores";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { Link } from "@/i18n/navigation";
import { listPromotions } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.promotions");
  return { title: t("title") };
}

// The promotions (buyer-discount increment): a page read on the server for the filters in the address.
export default async function PromotionsPage({
  searchParams,
}: PageProps<"/[locale]/admin/promotions">) {
  await requireAdmin("/admin/promotions");
  const filter = loadPromotionSearchParams(await searchParams);
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);

  const [{ data: page }, stores] = await Promise.all([
    listPromotions({
      headers,
      query: {
        status: filter.status ?? undefined,
        q: filter.q || undefined,
        sellerId: filter.store ?? undefined,
        page: filter.page,
        size: filter.size,
      },
    }),
    loadStores(headers),
  ]);

  return (
    <>
      <AdminTopBar crumbs={[{ label: t("group.operations") }, { label: t("promotions.title") }]} />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="flex-1 text-page-title text-foreground">{t("promotions.title")}</h1>
          <Link
            href="/admin/promotions/payouts"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <WalletIcon data-icon="inline-start" aria-hidden />
            {t("promotions.payouts")}
          </Link>
          <Link href="/admin/promotions/new" className={cn(buttonVariants({ size: "lg" }))}>
            <PlusIcon data-icon="inline-start" aria-hidden />
            {t("promotions.create")}
          </Link>
        </div>
        <PromotionsList
          promotions={page.items}
          total={page.total}
          counts={page.counts}
          stores={stores}
        />
      </div>
    </>
  );
}
