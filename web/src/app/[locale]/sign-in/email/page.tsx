import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { AuthScreen } from "@/features/identity/auth-screen";
import { getCurrentAccount } from "@/features/identity/current-account";
import { readReturnTo } from "@/features/identity/return-to";
import { SignInForm } from "@/features/identity/sign-in-form";
import { SignInHero } from "@/features/identity/sign-in-hero";
import { redirect } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/sign-in/email">): Promise<Metadata> {
  const t = await getTranslations("SignIn");
  return pageMetadata({ locale: (await params).locale, title: t("emailTitle"), index: false });
}

// Signing in with the emailed code (SEC-29 › Web, Figma L12 and L9), on a screen of its own since SEC-193: an address,
// then the six digits sent to it, and back to the page `returnTo` names.
export default async function SignInByEmailPage({
  searchParams,
}: PageProps<"/[locale]/sign-in/email">) {
  const t = await getTranslations("SignIn");
  const returnTo = searchParams.then((query) => readReturnTo(query.returnTo));

  return (
    <AuthScreen title={t("emailTitle")} back={returnTo} hero={<SignInHero />}>
      <SignInByEmail returnTo={returnTo} />
    </AuthScreen>
  );
}

async function SignInByEmail({ returnTo: pending }: { returnTo: Promise<string> }) {
  const [returnTo, account] = await Promise.all([pending, getCurrentAccount()]);
  if (account) redirect({ href: returnTo, locale: await getLocale() });
  return <SignInForm returnTo={returnTo} />;
}
