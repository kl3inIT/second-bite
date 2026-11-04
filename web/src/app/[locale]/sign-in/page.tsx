import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { AuthScreen } from "@/features/identity/auth-screen";
import { getCurrentAccount } from "@/features/identity/current-account";
import { PasswordSignInForm } from "@/features/identity/password-sign-in-form";
import { readReturnTo } from "@/features/identity/return-to";
import { SignInHero } from "@/features/identity/sign-in-hero";
import { redirect } from "@/i18n/navigation";
import { getSignInMethods } from "@/lib/api/generated";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/sign-in">): Promise<Metadata> {
  const t = await getTranslations("SignIn");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The sign-in screen (SEC-29 › Web, SEC-193), reached when an action needs an account, with `returnTo` naming the
// page to go back to. It opens on a username and a password (Figma L11); the emailed code is on its own screen
// (`/sign-in/email`), Google's button is under the password's, and `/register` makes an account.
export default async function SignInPage({ searchParams }: PageProps<"/[locale]/sign-in">) {
  const t = await getTranslations("SignIn");
  const returnTo = searchParams.then((query) => readReturnTo(query.returnTo));

  return (
    <AuthScreen title={t("title")} back={returnTo} hero={<SignInHero />}>
      <SignIn returnTo={returnTo} />
    </AuthScreen>
  );
}

async function SignIn({ returnTo: pending }: { returnTo: Promise<string> }) {
  const [returnTo, account, methods] = await Promise.all([
    pending,
    getCurrentAccount(),
    getSignInMethods(),
  ]);
  // Already signed in: nothing to do here.
  if (account) redirect({ href: returnTo, locale: await getLocale() });
  return <PasswordSignInForm returnTo={returnTo} googleClientId={methods.data.google?.clientId} />;
}
