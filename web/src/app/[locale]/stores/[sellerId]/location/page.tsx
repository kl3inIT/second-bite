import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { PushedMarker } from "@/features/seller/pushed-marker";
import { StoreLocation } from "@/features/seller/store-location";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/location">): Promise<Metadata> {
  const t = await getTranslations("StoreLocationPage");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The owner moves the store's pin (SEC-66).
export default function StoreLocationPage({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/location">) {
  const sellerId = params.then((p) => p.sellerId);

  return (
    <>
      <PushedMarker />
      <Suspense fallback={<Skeleton shape="card" className="mx-auto h-130 max-w-xl" />}>
        <StoreLocation sellerId={sellerId} />
      </Suspense>
    </>
  );
}
