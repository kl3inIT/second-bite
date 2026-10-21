import { Suspense } from "react";

import { AccountAction } from "@/features/identity/account-action";

import { AppHeader } from "./app-header";
import { BackButton } from "./back-button";

// The blue top bar of an inner screen (Figma "Top bar" on Tasco blue: K5, D1, D5): its white back button, unless
// the screen is a tab of its own, and the screen's name as its heading. From `md` the screen has the customer
// header instead (Figma Web): the wordmark, the screen's name, the account and the language; `returnTo`
// is where the sign-in leads back to, and without it the header has no account.
export function PageBar({
  title,
  back,
  returnTo,
}: {
  title: string;
  back?: string;
  returnTo?: string;
}) {
  return (
    <>
      <header className="bg-header text-header-foreground md:hidden">
        <div className="mx-auto flex h-16 w-full max-w-xl items-center gap-3 px-4">
          {back ? <BackButton fallback={back} /> : null}
          <h1 className="truncate text-bar-title">{title}</h1>
        </div>
      </header>
      <div className="max-md:hidden">
        <AppHeader
          title={<h1 className="text-bar-title">{title}</h1>}
          account={
            returnTo ? (
              <Suspense>
                <AccountAction returnTo={returnTo} />
              </Suspense>
            ) : undefined
          }
        />
      </div>
    </>
  );
}
