import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { MyOrders, readWhich } from "@/features/orders/orders-list";
import { OrdersHeader } from "@/features/orders/orders-header";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Orders");
  return { title: `${t("mine")} · Second Bite`, robots: { index: false } };
}

// "Đơn của tôi" (SEC-51, Figma W7, mobile K8): the orders still to collect and those that have ended. A tab
// of its own on a phone, reached from the bottom bar.
export default async function MyOrdersPage({ searchParams }: PageProps<"/[locale]/orders">) {
  const t = await getTranslations("Orders");
  const which = searchParams.then((query) => readWhich(query.state));

  return (
    <>
      <OrdersHeader returnTo="/orders" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-24 md:pt-8 md:pb-10 xl:max-w-300">
        <h1 className="text-headline">{t("mine")}</h1>
        <p className="mb-6 text-body-sm text-muted-foreground">{t("mineLead")}</p>
        <Suspense fallback={<Skeleton shape="card" className="h-40" />}>
          <MyOrders which={which} />
        </Suspense>
      </main>
      <BottomNav />
    </>
  );
}
