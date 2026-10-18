import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/language-switcher";

// The green shell of every customer page (Figma TopBar): the place, then the language icon.
export function TopBar() {
  const t = useTranslations("Home");

  return (
    <header className="bg-shell text-shell-foreground">
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
