import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { OrdersList, OrdersTabs, readWhich } from "@/features/orders/orders-list";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Orders");
  return { title: `${t("mine")} · Second Bite`, robots: { index: false } };
}

// "Đơn của tôi" (SEC-51, Figma W7, mobile K8): the orders still to collect, or those that have ended. A tab
// of its own on a phone, reached from the bottom bar.
export default async function MyOrdersPage({ searchParams }: PageProps<"/[locale]/orders">) {
  const t = await getTranslations("Orders");
  const which = searchParams.then((query) => readWhich(query.state));

  return (
    <>
      <TopBar title={t("mine")} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-4 pb-24 md:pt-8 md:pb-10">
        <h1 className="sr-only sm:not-sr-only sm:mb-4 sm:block sm:text-headline">{t("mine")}</h1>
        <Suspense fallback={<Skeleton shape="card" className="h-11" />}>
          <OrdersTabs which={which} />
        </Suspense>
        <Suspense fallback={<Skeleton shape="card" className="mt-4 h-32" />}>
          <OrdersList which={which} />
        </Suspense>
      </main>
      <BottomNav />
    </>
  );
}
