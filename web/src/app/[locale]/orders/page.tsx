import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { PageBar } from "@/components/page-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { MyOrders, readWhich } from "@/features/orders/orders-list";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Orders");
  return { title: `${t("mine")} · Second Bite`, robots: { index: false } };
}

// "Đơn của tôi" (SEC-51, Figma D1, D4): the orders still to collect and those that have ended. A tab of its
// own, reached from the bottom bar, so its blue bar has no back button.
export default async function MyOrdersPage({ searchParams }: PageProps<"/[locale]/orders">) {
  const t = await getTranslations("Orders");
  const which = searchParams.then((query) => readWhich(query.state));

  return (
    <>
      <PageBar title={t("mine")} />
      <main className="flex flex-1 flex-col pb-10">
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-xl px-4 py-4">
              <Skeleton shape="card" className="h-40" />
            </div>
          }
        >
          <MyOrders which={which} />
        </Suspense>
      </main>
    </>
  );
}
