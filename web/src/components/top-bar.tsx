import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/language-switcher";

// The top bar of every customer page (Figma "Top bar"): white with a hairline below; the place, then
// the language icon.
export function TopBar() {
  const t = useTranslations("Home");

  return (
    <header className="border-b border-border bg-shell text-shell-foreground">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-2 px-4">
        <p className="flex items-center gap-2 text-title">
          <MapPinIcon aria-hidden className="size-5" />
          <span className="sr-only">{t("placeLabel")}: </span>
          {t("place")}
        </p>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
