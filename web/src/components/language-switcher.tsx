"use client";

import { LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";

// The language capsule of the header (Figma "mini app capsule"): one tap opens the same page in the other
// language, and next-intl's locale cookie keeps the choice. The capsule is 32px; the target around it is 44px.
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
      className="group/language -my-1.5 flex size-11 items-center justify-center rounded-full focus-visible:ring-3 focus-visible:ring-highlight focus-visible:outline-none"
    >
      <span className="flex h-8 items-center rounded-full border border-shell-border bg-shell-raised px-2.5 text-shell-raised-foreground transition-colors group-hover/language:bg-shell-border">
        <LanguagesIcon aria-hidden className="size-4" />
      </span>
    </Link>
  );
}
