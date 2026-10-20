import { getTranslations } from "next-intl/server";

import { Wordmark } from "@/components/wordmark";

// The panel beside the sign-in form on a wide screen (Figma L6, L9): the wordmark, a headline and the
// copyright line on the sky blue (decorative only: white holds 2.4:1 on it). It repeats what the form's heading says, so it is hidden from assistive
// technology; below 1024 px it is not drawn at all.
export async function SignInHero() {
  const t = await getTranslations("SignIn");
  return (
    <aside
      aria-hidden
      data-decorative
      className="relative hidden bg-sky text-primary-foreground lg:col-span-2 lg:flex lg:flex-col lg:items-center lg:justify-center"
    >
      <Wordmark className="absolute top-8 left-8 h-7.5" />
      <p className="text-center text-hero">
        {t("heroLine1")}
        <br />
        {t("heroLine2")}
      </p>
      <p className="absolute bottom-6 left-8 text-body-sm">© Second Bite</p>
    </aside>
  );
}
