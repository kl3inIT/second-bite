import { UserRoundIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { AccountMenu } from "./account-menu";
import { getCurrentAccount } from "./current-account";

// The header's account capsule (SEC-29 › Web): "Đăng nhập" for anyone, back to this page afterwards, or the
// signed-in account's menu with sign-out, and "Mở quán" (opening a store, Figma H1) beside it. It reads the session, so it renders inside a Suspense boundary.
export async function AccountAction({ returnTo }: { returnTo: string }) {
  const [t, account] = await Promise.all([getTranslations("Account"), getCurrentAccount()]);
  if (account) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/stores"
          className="group/open-store -my-1.5 flex min-h-11 items-center rounded-full focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
        >
          <span className="flex h-8 items-center rounded-full bg-secondary px-3 text-label-strong whitespace-nowrap text-secondary-foreground transition-colors group-hover/open-store:bg-secondary-hover">
            {t("openStore")}
          </span>
        </Link>
        <AccountMenu email={account.email} displayName={account.displayName} />
      </div>
    );
  }

  return (
    <Link
      href={{ pathname: "/sign-in", query: { returnTo } }}
      className="group/sign-in -my-1.5 flex min-h-11 items-center rounded-full focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
    >
      <span className="flex h-8 items-center gap-1.5 rounded-full border border-header-border bg-header-raised px-3 text-label-strong text-header-raised-foreground transition-colors group-hover/sign-in:bg-secondary">
        <UserRoundIcon aria-hidden className="size-4" />
        {t("signIn")}
      </span>
    </Link>
  );
}
