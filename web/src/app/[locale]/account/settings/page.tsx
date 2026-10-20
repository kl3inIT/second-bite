import { ChevronRightIcon, UserRoundIcon } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentAccount } from "@/features/identity/current-account";
import { getMySellers } from "@/features/identity/my-sellers";
import { Link, redirect } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/account/settings">): Promise<Metadata> {
  const t = await getTranslations("AccountSettings");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// Account settings (SEC-37, Figma Q2): the account's own data, read-only, then at its foot the way to delete
// it, which is not offered beside sign-out. The account menu and the account tab lead here. It is someone's
// own, so it is not indexed.
export default async function AccountSettingsPage() {
  const t = await getTranslations("AccountSettings");

  return (
    <>
      <AppHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 pt-2 pb-8 md:pt-6">
        <h1 className="text-headline text-foreground">{t("title")}</h1>
        <Suspense fallback={<Skeleton shape="card" className="h-64" />}>
          <Settings />
        </Suspense>
      </main>
    </>
  );
}

// The signed-in account and its sellers; someone signed out is sent to sign in, then back here. It reads the
// session, so it renders inside Suspense.
async function Settings() {
  const [t, account, locale] = await Promise.all([
    getTranslations("AccountSettings"),
    getCurrentAccount(),
    getLocale(),
  ]);
  if (!account) {
    return redirect({
      href: { pathname: "/sign-in", query: { returnTo: "/account/settings" } },
      locale,
    });
  }
  const sellers = await getMySellers();

  return (
    <>
      <section
        aria-labelledby="settings-who"
        className="flex items-center gap-3 rounded-2xl bg-card p-4 text-card-foreground"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <UserRoundIcon aria-hidden className="size-6" />
        </span>
        <div className="flex min-w-0 flex-col">
          <h2 id="settings-who" className="truncate text-title">
            {account.displayName || account.email}
          </h2>
          {account.displayName && (
            <p className="truncate text-body-sm text-muted-foreground">{account.email}</p>
          )}
        </div>
      </section>

      <section
        aria-labelledby="settings-details"
        className="rounded-2xl bg-card p-1 text-card-foreground"
      >
        <h2 id="settings-details" className="sr-only">
          {t("details")}
        </h2>
        <dl className="flex flex-col">
          <Row label={t("email")}>{account.email}</Row>
          <Row label={t("displayName")}>{account.displayName || t("noDisplayName")}</Row>
          {sellers.length > 0 && (
            <Row label={t("sellers")}>
              {sellers.map((seller) => `${seller.name} · ${t(seller.role)}`).join(", ")}
            </Row>
          )}
          <Row label={t("language")}>
            <Link
              href="/account/settings"
              locale={locale === "vi" ? "en" : "vi"}
              title={t("switchLanguage")}
              className="-my-2 inline-flex min-h-11 items-center gap-1 rounded-md hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
            >
              {t("languageName")}
              <ChevronRightIcon aria-hidden className="size-4" />
              <span className="sr-only">{t("switchLanguage")}</span>
            </Link>
          </Row>
        </dl>
      </section>

      <section
        aria-labelledby="settings-delete"
        className="flex flex-col gap-3 rounded-2xl bg-card p-4 text-card-foreground"
      >
        <h2 id="settings-delete" className="text-title">
          {t("deleteTitle")}
        </h2>
        <p className="text-body-sm text-muted-foreground">{t("deleteBody")}</p>
        <Link
          href="/delete-account"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "border-destructive text-destructive hover:bg-destructive/10",
          )}
        >
          {t("deleteAction")}
        </Link>
      </section>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-4 px-3 py-2">
      <dt className="shrink-0 text-body-sm">{label}</dt>
      <dd className="min-w-0 truncate text-right text-body-sm text-muted-foreground">{children}</dd>
    </div>
  );
}
