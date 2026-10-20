import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { StoreSoon } from "@/features/seller/store-soon";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/orders">): Promise<Metadata> {
  const t = await getTranslations("StoreSoon");
  return pageMetadata({ locale: (await params).locale, title: t("orders.title"), index: false });
}

// The store's order tab (SEC-57, Figma Q4): built with the order module (SEC-15, SEC-51).
export default function StoreOrdersPage({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/orders">) {
  const sellerId = params.then((p) => p.sellerId);

  return (
    <Suspense fallback={<Skeleton shape="card" className="h-36" />}>
      <StoreSoon sellerId={sellerId} tab="orders" />
    </Suspense>
  );
}
