import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { TopBar } from "@/components/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountPanel } from "@/features/identity/account-panel";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Account");
  return { title: `${t("title")} · Second Bite`, robots: { index: false } };
}

// The account tab: a screen of its own on a phone, reached from the bottom bar.
export default async function AccountPage() {
  const t = await getTranslations("Account");

  return (
    <>
      <TopBar title={t("title")} />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 pt-4 pb-8">
        <h1 className="sr-only">{t("title")}</h1>
        <Suspense fallback={<Skeleton shape="card" className="h-36" />}>
          <AccountPanel />
        </Suspense>
      </main>
    </>
  );
}
