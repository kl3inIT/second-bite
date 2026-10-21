import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { CatalogPost } from "@/features/seller/catalog-post";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/catalog/[dishId]/post">): Promise<Metadata> {
  const t = await getTranslations("PostDrawer");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// Posting a dish straight from the catalog (SEC-55, Figma D1): the drawer over the catalog.
export default function CatalogPostPage({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/catalog/[dishId]/post">) {
  const sellerId = params.then((p) => p.sellerId);
  const dishId = params.then((p) => p.dishId);

  return (
    <Suspense fallback={<Skeleton shape="card" className="h-60" />}>
      <CatalogPost sellerId={sellerId} dishId={dishId} />
    </Suspense>
  );
}
