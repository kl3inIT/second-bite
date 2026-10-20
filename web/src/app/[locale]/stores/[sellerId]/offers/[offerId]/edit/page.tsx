import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { PostChange } from "@/features/seller/post-change";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/offers/[offerId]/edit">): Promise<Metadata> {
  const t = await getTranslations("PostDrawer");
  return pageMetadata({ locale: (await params).locale, title: t("editTitle"), index: false });
}

// Changing a live post (SEC-57, Figma E1, E2): the drawer over the store's post list.
export default function PostEditPage({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/offers/[offerId]/edit">) {
  const sellerId = params.then((p) => p.sellerId);
  const offerId = params.then((p) => p.offerId);

  return (
    <Suspense fallback={<Skeleton shape="card" className="h-60" />}>
      <PostChange sellerId={sellerId} offerId={offerId} mode="edit" />
    </Suspense>
  );
}
