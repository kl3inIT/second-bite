import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { PromotionForm } from "@/features/admin-promotions/promotion-form";
import { PromotionStatusBadge } from "@/features/admin-promotions/promotion-status";
import { loadStores } from "@/features/admin-promotions/stores";
import { requireAdmin } from "@/features/identity/current-account";
import { sessionHeaders } from "@/features/identity/session";
import { vietnamToday } from "@/features/seller/store-day";
import { ApiError } from "@/lib/api/client";
import { getPromotion } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.promotions");
  return { title: t("title") };
}

// One promotion (buyer-discount increment): its form filled, and beside it what its budget has spent.
export default async function PromotionPage({
  params,
}: PageProps<"/[locale]/admin/promotions/[promotionId]">) {
  const { promotionId } = await params;
  await requireAdmin(`/admin/promotions/${promotionId}`);
  const [t, headers] = await Promise.all([getTranslations("Admin"), sessionHeaders()]);

  let read;
  try {
    read = await Promise.all([
      getPromotion({ headers, path: { promotionId } }),
      loadStores(headers),
    ]);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 400 || error.status === 404)) notFound();
    throw error;
  }
  const [{ data: promotion }, stores] = read;

  return (
    <>
      <AdminTopBar
        crumbs={[
          { label: t("promotions.title"), href: "/admin/promotions" },
          { label: promotion.name },
        ]}
      />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-page-title text-foreground">{promotion.name}</h1>
          <PromotionStatusBadge status={promotion.status} />
        </div>
        <PromotionForm promotion={promotion} stores={stores} today={vietnamToday()} />
      </div>
    </>
  );
}
