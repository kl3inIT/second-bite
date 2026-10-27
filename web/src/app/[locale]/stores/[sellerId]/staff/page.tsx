import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { PushedMarker } from "@/features/seller/pushed-marker";
import { StoreStaff } from "@/features/seller/store-staff";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/staff">): Promise<Metadata> {
  const t = await getTranslations("StoreStaffPage");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The store's people (SEC-162, Figma N1 to N3): the owner adds and removes staff, and staff see who works there.
export default function StoreStaffPage({ params }: PageProps<"/[locale]/stores/[sellerId]/staff">) {
  const sellerId = params.then((p) => p.sellerId);

  return (
    <>
      <PushedMarker />
      <Suspense fallback={<Skeleton shape="card" className="mx-auto h-100 max-w-xl" />}>
        <StoreStaff sellerId={sellerId} />
      </Suspense>
    </>
  );
}
