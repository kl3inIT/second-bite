import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { AuthScreen } from "@/features/identity/auth-screen";
import { getCurrentAccount } from "@/features/identity/current-account";
import { RegisterForm } from "@/features/identity/register-form";
import { readReturnTo } from "@/features/identity/return-to";
import { SignInHero } from "@/features/identity/sign-in-hero";
import { redirect } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/register">): Promise<Metadata> {
  const t = await getTranslations("Register");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// Making an account with a username and a password (SEC-193, Figma L10): the username, the password and the
// password again, then signed in and back to the page `returnTo` names.
export default async function RegisterPage({ searchParams }: PageProps<"/[locale]/register">) {
  const t = await getTranslations("Register");
  const returnTo = searchParams.then((query) => readReturnTo(query.returnTo));

  return (
    <AuthScreen title={t("title")} back={returnTo} hero={<SignInHero register />}>
      <Register returnTo={returnTo} />
    </AuthScreen>
  );
}

async function Register({ returnTo: pending }: { returnTo: Promise<string> }) {
  const [returnTo, account] = await Promise.all([pending, getCurrentAccount()]);
  // Already signed in: nothing to do here.
  if (account) redirect({ href: returnTo, locale: await getLocale() });
  return <RegisterForm returnTo={returnTo} />;
}
