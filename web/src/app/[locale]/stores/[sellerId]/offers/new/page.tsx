import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { PostNew } from "@/features/seller/post-new";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/offers/new">): Promise<Metadata> {
  const t = await getTranslations("PostDrawer");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// Posting a dish (SEC-57, Figma P1 to P3): the drawer over the store's post list. `from` is the post it is
// posted again from (Figma R1).
export default function PostNewPage({
  params,
  searchParams,
}: PageProps<"/[locale]/stores/[sellerId]/offers/new">) {
  const sellerId = params.then((p) => p.sellerId);
  const from = searchParams.then((query) =>
    typeof query.from === "string" ? query.from : undefined,
  );

  return (
    <Suspense fallback={<Skeleton shape="card" className="h-60" />}>
      <PostNew sellerId={sellerId} from={from} />
    </Suspense>
  );
}
