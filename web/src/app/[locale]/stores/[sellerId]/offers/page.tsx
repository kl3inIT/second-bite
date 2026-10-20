import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { StorePosts } from "@/features/seller/store-posts";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/offers">): Promise<Metadata> {
  const t = await getTranslations("StorePosts");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The store's posts (SEC-57, Figma Q2, S1, S2): what is on sale, sold out and over, each with its action.
export default function StorePostsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/stores/[sellerId]/offers">) {
  const sellerId = params.then((p) => p.sellerId);
  const tab = searchParams.then((query) => (typeof query.tab === "string" ? query.tab : undefined));
  const notice = searchParams.then((query) =>
    typeof query.notice === "string" ? query.notice : undefined,
  );

  return (
    <Suspense fallback={<Skeleton shape="card" className="h-60" />}>
      <StorePosts sellerId={sellerId} tab={tab} notice={notice} />
    </Suspense>
  );
}
