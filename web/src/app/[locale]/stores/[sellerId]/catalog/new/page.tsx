import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { CatalogDish } from "@/features/seller/catalog-dish";
import { PushedMarker } from "@/features/seller/pushed-marker";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/catalog/new">): Promise<Metadata> {
  const t = await getTranslations("DishForm");
  return pageMetadata({ locale: (await params).locale, title: t("addTitle"), index: false });
}

// Adding a dish to the catalog (SEC-55, Figma Q3c).
export default function CatalogNewPage({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/catalog/new">) {
  const sellerId = params.then((p) => p.sellerId);

  return (
    <>
      <PushedMarker />
      <Suspense fallback={<Skeleton shape="card" className="mx-auto h-130 max-w-xl" />}>
        <CatalogDish sellerId={sellerId} />
      </Suspense>
    </>
  );
}
