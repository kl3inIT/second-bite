import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { StoreCatalog } from "@/features/seller/store-catalog";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/catalog">): Promise<Metadata> {
  const t = await getTranslations("StoreCatalog");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The store's catalog tab (SEC-55, Figma Q3, Q3b): the dishes it sells, each posted in one press.
export default function StoreCatalogPage({
  params,
  searchParams,
}: PageProps<"/[locale]/stores/[sellerId]/catalog">) {
  const sellerId = params.then((p) => p.sellerId);
  const notice = searchParams.then((query) =>
    typeof query.notice === "string" ? query.notice : undefined,
  );

  return (
    <Suspense fallback={<Skeleton shape="card" className="h-60" />}>
      <StoreCatalog sellerId={sellerId} notice={notice} />
    </Suspense>
  );
}
