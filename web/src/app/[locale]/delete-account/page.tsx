import { TriangleAlertIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountAction } from "@/features/identity/account-action";
import { getCurrentAccount } from "@/features/identity/current-account";
import { DeleteAccountDone, DeleteAccountForm } from "@/features/identity/delete-account-form";
import { getOwnedSellerNames } from "@/features/identity/my-sellers";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/delete-account">): Promise<Metadata> {
  const t = await getTranslations("DeleteAccount");
  return pageMetadata({
    locale: (await params).locale,
    path: "/delete-account",
    title: t("title"),
    description: t("description"),
  });
}

// Deleting an account (SEC-37): what goes at once, what follows within minutes and what is kept, readable by
// anyone at this address, the web link Google Play asks for; then, for the signed-in person, the deletion
// itself, or the way to sign in first. Account settings, on the web and in the app, leads here. Right after a
// deletion the page is only its confirmation (Figma Q5, SEC-69).
export default async function DeleteAccountPage({
  searchParams,
}: PageProps<"/[locale]/delete-account">) {
  const t = await getTranslations("DeleteAccount");
  const done = searchParams.then((query) => query.done === "1");

  return (
    <>
      <AppHeader
        account={
          <Suspense>
            <AccountAction returnTo="/delete-account" />
          </Suspense>
        }
      />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 pt-2 pb-12 md:pt-6">
        <h1 className="text-headline text-foreground">{t("title")}</h1>
        <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
          <Content done={done} />
        </Suspense>
      </main>
    </>
  );
}

// The confirmation right after a deletion (`?done=1`, no one signed in), which Apple asks for (SEC-69);
// otherwise what the deletion takes and the action. Someone signed in at `?done=1` still gets the deletion.
// It reads the session, so it renders inside Suspense.
async function Content({ done: pending }: { done: Promise<boolean> }) {
  const [t, account, done] = await Promise.all([
    getTranslations("DeleteAccount"),
    getCurrentAccount(),
    pending,
  ]);

  if (!account && done) {
    return (
      <section className="rounded-2xl border border-border bg-card p-4 text-card-foreground md:px-7 md:py-6">
        <DeleteAccountDone />
      </section>
    );
  }

  return (
    <>
      <p className="text-body-sm text-foreground">{t("intro")}</p>
      <section
        aria-label={t("title")}
        className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-4 text-card-foreground md:px-7 md:py-6"
      >
        <What title={t("deletedTitle")} items={t.raw("deleted") as string[]} />
        <What title={t("laterTitle")} items={t.raw("later") as string[]} />
        <What title={t("keptTitle")} items={t.raw("kept") as string[]} />
      </section>
      <Action email={account?.email} />
    </>
  );
}

function What({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-title">{title}</h2>
      <ul className="flex list-disc flex-col gap-1 pl-5 text-body-sm">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// The deletion for the signed-in person (their address), warned first when they own a seller; otherwise the
// way to sign in, back to this page.
async function Action({ email }: { email?: string }) {
  const t = await getTranslations("DeleteAccount");

  if (!email) {
    return (
      <section
        aria-labelledby="delete-account-sign-in"
        className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-card-foreground md:px-7 md:py-6"
      >
        <h2 id="delete-account-sign-in" className="text-title">
          {t("signedOutTitle")}
        </h2>
        <p className="text-body-sm">{t("signedOutBody")}</p>
        <Link
          href={{ pathname: "/sign-in", query: { returnTo: "/delete-account" } }}
          className={buttonVariants({ size: "lg" })}
        >
          {t("signIn")}
        </Link>
      </section>
    );
  }

  const owned = await getOwnedSellerNames();

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 text-card-foreground md:px-7 md:py-6">
      {owned.length > 0 && (
        <Alert variant="warning">
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>{t("ownerTitle")}</AlertTitle>
          <AlertDescription>{t("ownerBody", { sellers: owned.join(", ") })}</AlertDescription>
        </Alert>
      )}
      <DeleteAccountForm email={email} />
    </section>
  );
}
