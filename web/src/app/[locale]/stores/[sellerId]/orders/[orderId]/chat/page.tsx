import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { StoreChat } from "@/features/chat/store-chat";
import { PushedMarker } from "@/features/seller/pushed-marker";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/orders/[orderId]/chat">): Promise<Metadata> {
  const t = await getTranslations("Chat");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The store's chat with the customer of an order (SEC-117, Figma Q7, Q5m), reached by "Nhắn khách" or "Trả lời" on
// the order's page. On a phone it is a pushed screen, so its marker sits here, outside Suspense.
export default function StoreChatPage({
  params,
}: PageProps<"/[locale]/stores/[sellerId]/orders/[orderId]/chat">) {
  const sellerId = params.then((p) => p.sellerId);
  const orderId = params.then((p) => p.orderId);

  return (
    <>
      <PushedMarker />
      <Suspense fallback={<Skeleton shape="card" className="h-80" />}>
        <StoreChat sellerId={sellerId} orderId={orderId} />
      </Suspense>
    </>
  );
}
