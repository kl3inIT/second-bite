import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountAction } from "@/features/identity/account-action";
import { AccountPanel } from "@/features/identity/account-panel";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/account">): Promise<Metadata> {
  const t = await getTranslations("Account");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The account tab: a screen of its own on a phone, reached from the bottom bar; under the header of
// Figma's seller screens on every width (SEC-52). It is someone's own, so it is not indexed.
export default async function AccountPage() {
  const t = await getTranslations("Account");

  return (
    <>
      <AppHeader
        account={
          // A phone reaches the account from its bottom bar, so its header keeps no account (as before SEC-101).
          <div className="max-md:hidden">
            <Suspense>
              <AccountAction returnTo="/account" />
            </Suspense>
          </div>
        }
      />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 pt-2 pb-8 md:max-w-292 md:pt-6">
        <h1 className="text-headline text-foreground md:sr-only">{t("title")}</h1>
        <Suspense fallback={<Skeleton shape="card" className="h-36" />}>
          <AccountPanel />
        </Suspense>
      </main>
    </>
  );
}
