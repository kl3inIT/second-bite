import { useTranslations } from "next-intl";

import { Wordmark } from "./wordmark";

// What covers the screen while a page's list is fetched: the wordmark in its middle, its letters hopping in
// Tasco blue, and the words for assistive technology.
export function BrandLoader() {
  const t = useTranslations("Splash");

  return (
    <output className="fixed inset-0 z-50 flex items-center justify-center bg-background text-primary">
      <Wordmark className="h-10 letters-wave" />
      <span className="sr-only">{t("loading")}</span>
    </output>
  );
}
