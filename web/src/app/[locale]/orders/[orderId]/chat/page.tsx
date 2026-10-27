import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { CustomerChat } from "@/features/chat/customer-chat";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Chat");
  return { title: `${t("title")} · Second Bite`, robots: { index: false } };
}

// A customer's chat with the seller of an order (SEC-117, Figma K7, K7b, WK8), reached by "Nhắn quán" on the order's
// page and its pickup card. The chat is a screen of its own, so the bottom bar and the footer stay out of it.
export default function OrderChatPage({ params }: PageProps<"/[locale]/orders/[orderId]/chat">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-xl px-4 py-8">
          <Skeleton shape="card" className="h-64" />
        </div>
      }
    >
      <CustomerChat params={params} />
    </Suspense>
  );
}
