import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { PushedMarker } from "@/features/seller/pushed-marker";
import { StoreEdit } from "@/features/seller/store-edit";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/edit">): Promise<Metadata> {
  const t = await getTranslations("StoreEditPage");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The owner edits the store's name, phone number and photo (SEC-141).
export default function StoreEditPage({
  params,
  searchParams,
}: PageProps<"/[locale]/stores/[sellerId]/edit">) {
  const sellerId = params.then((p) => p.sellerId);

  return (
    <>
      <PushedMarker />
      <Suspense fallback={<Skeleton shape="card" className="mx-auto h-130 max-w-xl" />}>
        <StoreEdit sellerId={sellerId} query={searchParams} />
      </Suspense>
    </>
  );
}
