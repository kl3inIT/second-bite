import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { StoreHome } from "@/features/seller/store-home";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]">): Promise<Metadata> {
  const t = await getTranslations("StoreHome");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The store's home (SEC-57, Figma Q1 and Q1b): the store, a day's overview with the day in the address (`?day=`),
// what to do now, and the day's orders, posts and the catalog.
export default function StoreHomePage({
  params,
  searchParams,
}: PageProps<"/[locale]/stores/[sellerId]">) {
  const sellerId = params.then((p) => p.sellerId);

  return (
    <Suspense fallback={<Skeleton shape="card" className="h-60" />}>
      <StoreHome sellerId={sellerId} query={searchParams} />
    </Suspense>
  );
}
