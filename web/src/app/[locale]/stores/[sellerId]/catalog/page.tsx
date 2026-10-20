import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { StoreSoon } from "@/features/seller/store-soon";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/catalog">): Promise<Metadata> {
  const t = await getTranslations("StoreSoon");
  return pageMetadata({ locale: (await params).locale, title: t("catalog.title"), index: false });
}

// The store's catalog tab (SEC-57, Figma Q3): built when its backend is (SEC-55).
export default function StoreCatalogPage({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/catalog">) {
  const sellerId = params.then((p) => p.sellerId);

  return (
    <Suspense fallback={<Skeleton shape="card" className="h-36" />}>
      <StoreSoon sellerId={sellerId} tab="catalog" />
    </Suspense>
  );
}
