import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { StoreOrders } from "@/features/seller/store-order-list";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/orders">): Promise<Metadata> {
  const t = await getTranslations("StoreOrders");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The store's order tab (SEC-78, Figma Q5): the orders of one day that customers hold, to hand over at the counter or cancel.
export default function StoreOrdersPage({
  params,
  searchParams,
}: PageProps<"/[locale]/stores/[sellerId]/orders">) {
  const sellerId = params.then((p) => p.sellerId);

  return (
    <Suspense fallback={<Skeleton shape="card" className="h-60" />}>
      <StoreOrders sellerId={sellerId} query={searchParams} />
    </Suspense>
  );
}
