import { useTranslations } from "next-intl";

import { Wordmark } from "./wordmark";

// What covers the screen while a page's list is fetched, moving like the splash: the wordmark in Tasco blue, its
// bitten "o" dropping in and then bouncing until the page is ready, the tagline fading in beneath, and the words
// for assistive technology.
export function BrandLoader() {
  const t = useTranslations("Splash");

  return (
    <output className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background text-primary">
      <Wordmark className="h-10 bite-bounce" />
      <span aria-hidden className="fade-in-late text-body-sm-strong text-muted-foreground">
        {t("tagline")}
      </span>
      <span className="sr-only">{t("loading")}</span>
    </output>
  );
}
