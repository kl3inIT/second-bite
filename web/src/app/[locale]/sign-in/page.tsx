import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { TopBar } from "@/components/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentAccount } from "@/features/identity/current-account";
import { readReturnTo } from "@/features/identity/return-to";
import { SignInForm } from "@/features/identity/sign-in-form";
import { redirect } from "@/i18n/navigation";
import { getSignInMethods } from "@/lib/api/generated";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/sign-in">): Promise<Metadata> {
  const t = await getTranslations("SignIn");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The sign-in screen (SEC-29 › Web), reached when an action needs an account, with `returnTo` naming the
// page to go back to. On a phone the form fills the screen under the white top bar; on a wide screen it
// sits on a 440 px card (Figma W1, W2).
export default async function SignInPage({ searchParams }: PageProps<"/[locale]/sign-in">) {
  const t = await getTranslations("SignIn");
  const returnTo = searchParams.then((query) => readReturnTo(query.returnTo));

  return (
    <>
      <Suspense fallback={<TopBar title={t("title")} back="/" />}>
        <BackToReturn title={t("title")} returnTo={returnTo} />
      </Suspense>
      <main className="flex flex-1 justify-center bg-card sm:bg-background sm:px-4 sm:py-10">
        <div className="w-full px-4 py-6 sm:h-fit sm:max-w-110 sm:rounded-2xl sm:bg-card sm:p-8">
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
