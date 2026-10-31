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
      <main className="mx-auto flex w-full max-w-130 flex-1 flex-col px-4 pt-2 pb-14 md:pt-8 lg:max-w-256 lg:flex-row lg:items-start lg:gap-16">
        <Suspense fallback={null}>
          <OpenStoreIntro />
        </Suspense>
        <div className="lg:w-130 lg:shrink-0">
          <Suspense fallback={<Skeleton shape="card" className="h-130" />}>
            <OpenStore />
          </Suspense>
        </div>
      </main>
    </>
  );
}

// The wide screen's left column (Figma O1-B): the heading, the line under it and the three steps of the form,
// beside the card. On a phone and a tablet the heading stays at the top of the card as before.
async function OpenStoreIntro() {
  const t = await getTranslations("OpenStore");
  const steps = [t("steps.details"), t("steps.pin"), t("steps.photo")];
  return (
    <section className="flex flex-1 flex-col gap-8 pt-8 max-lg:hidden">
      <header className="flex flex-col gap-3">
        <h1 className="text-display text-foreground">{t("heading")}</h1>
        <p className="text-body text-muted-foreground">{t("intro")}</p>
      </header>
      <ol className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-3 text-body-sm-strong text-foreground">
            <span
              aria-hidden
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary"
            >
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </section>
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
