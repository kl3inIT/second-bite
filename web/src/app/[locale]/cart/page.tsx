import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { BackButton } from "@/components/back-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkout } from "@/features/cart/checkout";
import { getCurrentAccount } from "@/features/identity/current-account";
import { getSignInMethods } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Cart");
  return { title: `${t("title")} · Second Bite`, robots: { index: false } };
}

// The cart's confirmation (Figma K5) under the blue top bar with its white back button. The cart lives in
// this browser (SEC-49 decision 7), so the page draws it on the client; the server says who is signed in,
// which "Đặt món" needs (SEC-76). `?continue=1` is the way back from signing in.
export default async function CartPage({ searchParams }: PageProps<"/[locale]/cart">) {
  const t = await getTranslations("Cart");

  return (
    <>
      <header className="bg-header text-header-foreground">
        <div className="mx-auto flex h-16 w-full max-w-xl items-center gap-3 px-4">
          <BackButton fallback="/" />
          <h1 className="text-bar-title">{t("title")}</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<CheckoutSkeleton />}>
          <SignedCheckout resumed={searchParams.then((query) => query.continue === "1")} />
        </Suspense>
      </main>
    </>
  );
}

async function SignedCheckout({ resumed }: { resumed: Promise<boolean> }) {
  const [account, methods, back] = await Promise.all([
    getCurrentAccount(),
    getSignInMethods(),
    resumed,
  ]);

  // Signing in in the sheet comes back to this same page; a new key starts the checkout again with the account,
  // so it takes the step after signing in (SEC-76 decision 2).
  return (
    <Checkout
      key={account ? "signed-in" : "signed-out"}
      account={account}
      googleClientId={methods.data.google?.clientId}
      resumed={back}
    />
  );
}

function CheckoutSkeleton() {
  return (
    <div aria-hidden className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 pt-4">
      <Skeleton className="h-24" />
      <Skeleton className="h-36" />
      <Skeleton className="h-48" />
    </div>
  );
}
