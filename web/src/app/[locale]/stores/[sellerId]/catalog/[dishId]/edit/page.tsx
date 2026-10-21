import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { CatalogDish } from "@/features/seller/catalog-dish";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/catalog/[dishId]/edit">): Promise<Metadata> {
  const t = await getTranslations("DishForm");
  return pageMetadata({ locale: (await params).locale, title: t("editTitle"), index: false });
}

// Changing a dish of the catalog, showing or hiding it, or deleting it (SEC-55, Figma C1, C2).
export default function CatalogEditPage({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/catalog/[dishId]/edit">) {
  const sellerId = params.then((p) => p.sellerId);
  const dishId = params.then((p) => p.dishId);

  return (
    <Suspense fallback={<Skeleton shape="card" className="mx-auto h-130 max-w-xl" />}>
      <CatalogDish sellerId={sellerId} dishId={dishId} />
    </Suspense>
  );
}
