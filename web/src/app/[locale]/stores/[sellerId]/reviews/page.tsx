import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { PushedMarker } from "@/features/seller/pushed-marker";
import { StoreReviewsPage } from "@/features/seller/store-reviews-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/reviews">): Promise<Metadata> {
  const t = await getTranslations("StoreReviews");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The store's reviews, which its people and admins read (SEC-154).
export default function StoreReviewsRoute({
  params,
  searchParams,
}: PageProps<"/[locale]/stores/[sellerId]/reviews">) {
  const sellerId = params.then((p) => p.sellerId);

  return (
    <>
      <PushedMarker />
      <Suspense fallback={<Skeleton shape="card" className="mx-auto h-130 max-w-3xl" />}>
        <StoreReviewsPage sellerId={sellerId} query={searchParams} />
      </Suspense>
    </>
  );
}
