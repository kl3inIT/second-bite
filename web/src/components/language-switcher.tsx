"use client";

import { LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";

// The language icon of the top bar (Figma TopBar › LanguageButton): one tap opens the same page in
// the other language, and next-intl's locale cookie keeps the choice.
export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const pathname = usePathname();
  const other = useLocale() === "vi" ? "en" : "vi";

  return (
    <Link
      href={pathname}
      locale={other}
      aria-label={t("label")}
      title={t("label")}
      className={buttonVariants({ variant: "shell", size: "icon" })}
    >
      <LanguagesIcon aria-hidden />
    </Link>
  );
}
