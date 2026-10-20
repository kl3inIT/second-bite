import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { TopBar } from "@/components/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentAccount } from "@/features/identity/current-account";
import { readReturnTo } from "@/features/identity/return-to";
import { SignInForm } from "@/features/identity/sign-in-form";
import { SignInHero } from "@/features/identity/sign-in-hero";
import { redirect } from "@/i18n/navigation";
import { getSignInMethods } from "@/lib/api/generated";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SignIn");
  return { title: `${t("title")} · Second Bite`, robots: { index: false } };
}

// The sign-in screen (SEC-29 › Web), reached when an action needs an account, with `returnTo` naming the
// page to go back to. On a phone the form fills the screen under the white top bar; on a tablet it sits on a
// 440 px card (Figma W1, W2); from 1024 px the page splits in two, the blue panel and the bare form (Figma
// L6, L9; SEC-56).
export default async function SignInPage({ searchParams }: PageProps<"/[locale]/sign-in">) {
  const t = await getTranslations("SignIn");
  const returnTo = searchParams.then((query) => readReturnTo(query.returnTo));

  return (
    <>
      <div className="lg:hidden">
        <Suspense fallback={<TopBar title={t("title")} back="/" />}>
          <BackToReturn title={t("title")} returnTo={returnTo} />
        </Suspense>
      </div>
      <main
        data-no-footer
        className="flex flex-1 justify-center bg-card sm:bg-background sm:px-4 sm:py-10 lg:grid lg:min-h-svh lg:grid-cols-5 lg:p-0"
      >
        <SignInHero />
        <div className="w-full px-4 py-6 sm:h-fit sm:max-w-110 sm:rounded-2xl sm:bg-card sm:p-8 lg:col-span-3 lg:m-auto lg:max-w-100 lg:rounded-none lg:bg-transparent lg:p-0">
          <Suspense fallback={<SignInSkeleton />}>
            <SignIn returnTo={returnTo} />
          </Suspense>
        </div>
      </main>
    </>
  );
}

async function BackToReturn({ title, returnTo }: { title: string; returnTo: Promise<string> }) {
  return <TopBar title={title} back={await returnTo} />;
}

async function SignIn({ returnTo: pending }: { returnTo: Promise<string> }) {
  const [returnTo, account, methods] = await Promise.all([
    pending,
    getCurrentAccount(),
    getSignInMethods(),
  ]);
  // Already signed in: nothing to do here.
  if (account) redirect({ href: returnTo, locale: await getLocale() });
  return <SignInForm returnTo={returnTo} googleClientId={methods.data.google?.clientId} />;
}

function SignInSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-5">
      <Skeleton className="h-7 w-56" />
      <Skeleton className="h-11" />
      <Skeleton className="h-11" />
      <Skeleton className="h-13" />
    </div>
  );
}
