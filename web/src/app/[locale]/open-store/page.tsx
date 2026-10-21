import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentAccount } from "@/features/identity/current-account";
import { OpenStoreForm } from "@/features/seller/open-store-form";
import { PushedScreenHeader } from "@/features/seller/pushed-screen-header";
import { redirect } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/open-store">): Promise<Metadata> {
  const t = await getTranslations("OpenStore");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// Opening a store (SEC-57, Figma O1): anyone signed in may, there is no approval in the pilot. Someone who
// is not signed in is sent to sign in and comes back here.
export default function OpenStorePage() {
  return (
    <>
      <Suspense fallback={null}>
        <PushedScreenHeader namespace="OpenStore" back="/stores" />
      </Suspense>
      <main className="mx-auto flex w-full max-w-130 flex-1 flex-col px-4 pt-2 pb-14 md:pt-8">
        <Suspense fallback={<Skeleton shape="card" className="h-130" />}>
          <OpenStore />
        </Suspense>
      </main>
    </>
  );
}

async function OpenStore() {
  const account = await getCurrentAccount();
  if (!account) {
    redirect({
      href: { pathname: "/sign-in", query: { returnTo: "/open-store" } },
      locale: await getLocale(),
    });
  }
  return (
    <div className="rounded-2xl border border-border bg-card p-4 max-md:mb-24 sm:p-8">
      <OpenStoreForm />
    </div>
  );
}
