import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { PushedMarker } from "@/features/seller/pushed-marker";
import { StoreOrder } from "@/features/seller/store-order";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/orders/[orderId]">): Promise<Metadata> {
  const t = await getTranslations("StoreOrders.detail");
  return pageMetadata({ locale: (await params).locale, title: t("pushedTitle"), index: false });
}

// An order's own page for the store (SEC-102, Figma Q5j, Q5k, O2, O3): where the order stands and what the seller does
// next. On a phone it is a pushed screen, so its marker sits here, outside Suspense.
export default function StoreOrderPage({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/orders/[orderId]">) {
  const sellerId = params.then((p) => p.sellerId);
  const orderId = params.then((p) => p.orderId);

  return (
    <>
      <PushedMarker />
      <Suspense fallback={<Skeleton shape="card" className="h-80" />}>
        <StoreOrder sellerId={sellerId} orderId={orderId} />
      </Suspense>
    </>
  );
}
