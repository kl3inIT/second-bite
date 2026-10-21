import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentAccount } from "@/features/identity/current-account";
import { getMySellers } from "@/features/seller/my-sellers";
import { MyStores } from "@/features/seller/my-stores";
import { redirect } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores">): Promise<Metadata> {
  const t = await getTranslations("Stores");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The stores of the person signed in (SEC-57, Figma S0): the stores they own or work for, or the way to open
// the first. Someone who is not signed in is sent to sign in and comes back here; someone with one store goes
// straight into it, and the list is for those with several.
export default function StoresPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex w-full max-w-136 flex-1 flex-col px-4 pt-2 pb-14 md:pt-8">
        <Suspense fallback={<Skeleton shape="card" className="h-36" />}>
          <Stores />
        </Suspense>
      </main>
    </>
  );
}

async function Stores() {
  const account = await getCurrentAccount();
  if (!account) {
    redirect({
      href: { pathname: "/sign-in", query: { returnTo: "/stores" } },
      locale: await getLocale(),
    });
  }
  const sellers = await getMySellers();
  if (sellers.length === 1) {
    redirect({ href: `/stores/${sellers[0].id}`, locale: await getLocale() });
  }
  return <MyStores />;
}
