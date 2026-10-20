import { ChevronRightIcon, Trash2Icon, UserRoundIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { Link } from "@/i18n/navigation";

import { getCurrentAccount } from "./current-account";
import { SignOutButton } from "./sign-out-button";

// The account tab (Figma "Tài khoản"): who is signed in and sign-out, or a way to sign in; then the terms
// and the privacy policy, which a shopping site must keep within reach (Decree 52/2013, SEC-32) and which
// on a phone live here rather than in a footer. It reads the session, so it renders inside Suspense.
export async function AccountPanel() {
  const [t, footer, account] = await Promise.all([
    getTranslations("Account"),
    getTranslations("Footer"),
    getCurrentAccount(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby="account-who"
        className="flex flex-col gap-4 rounded-2xl bg-card p-4 text-card-foreground"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <UserRoundIcon aria-hidden className="size-6" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h2 id="account-who" className="truncate text-title">
              {account ? account.displayName || account.email : t("guestTitle")}
            </h2>
            <p
              className={
                account
                  ? "truncate text-body-sm text-muted-foreground"
                  : "text-body-sm text-muted-foreground"
              }
            >
              {account ? (account.displayName ? account.email : t("signedIn")) : t("guestBody")}
            </p>
          </div>
        </div>
        {account ? (
          <SignOutButton />
        ) : (
          <Link
            href={{ pathname: "/sign-in", query: { returnTo: "/account" } }}
            className={buttonVariants({ size: "lg" })}
          >
            {t("signIn")}
          </Link>
        )}
      </section>
      <nav aria-label={footer("label")} className="rounded-2xl bg-card p-1 text-card-foreground">
        <ul className="flex flex-col">
          {(["terms", "privacy"] as const).map((page) => (
            <li key={page}>
              <Item render={<Link href={`/${page}`} />} className="min-h-12">
                <ItemContent>
                  <ItemTitle>{footer(page)}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon aria-hidden className="size-4 text-muted-foreground" />
                </ItemActions>
              </Item>
            </li>
          ))}
        </ul>
      </nav>
      {/* Deleting the account, where the stores ask for it: in the account's own settings (SEC-37). */}
      {account && (
        <div className="rounded-2xl bg-card p-1 text-card-foreground">
          <Item render={<Link href="/delete-account" />} className="min-h-12">
            <ItemContent>
              <ItemTitle>
                <span className="flex items-center gap-2 text-destructive">
                  <Trash2Icon aria-hidden className="size-4" />
                  {t("delete")}
                </span>
              </ItemTitle>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon aria-hidden className="size-4 text-muted-foreground" />
            </ItemActions>
          </Item>
        </div>
      )}
    </div>
  );
}
