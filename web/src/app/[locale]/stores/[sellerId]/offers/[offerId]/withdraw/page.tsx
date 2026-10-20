import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { PostChange } from "@/features/seller/post-change";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/offers/[offerId]/withdraw">): Promise<Metadata> {
  const t = await getTranslations("WithdrawDrawer");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// Withdrawing a live post (SEC-57, Figma E3, E3b): the drawer over the store's post list.
export default function PostWithdrawPage({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/offers/[offerId]/withdraw">) {
  const sellerId = params.then((p) => p.sellerId);
  const offerId = params.then((p) => p.offerId);

  return (
    <Suspense fallback={<Skeleton shape="card" className="h-60" />}>
      <PostChange sellerId={sellerId} offerId={offerId} mode="withdraw" />
    </Suspense>
  );
}
