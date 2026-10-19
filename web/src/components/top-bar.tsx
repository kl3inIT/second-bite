import { ChevronLeftIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { LanguageSwitcher } from "./language-switcher";
import { Wordmark } from "./wordmark";

// The white top bar of every screen but the home (DESIGN.md › White Shell, Figma "Top bar"): back to where
// the person came from (a tab's own screen has no back), the screen's name on a phone or the wordmark on a wide screen (Figma W1, W2), and
// the language. Screens carry no large title of their own.
export async function TopBar({ title, back }: { title: string; back?: string }) {
  const t = await getTranslations("TopBar");

  return (
    <header className="border-b border-border bg-shell text-shell-foreground">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-2 px-2">
        {back ? (
          <Link
            href={back}
            aria-label={t("back")}
            className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ChevronLeftIcon aria-hidden className="size-6" />
          </Link>
        ) : (
          <span aria-hidden className="w-2" />
        )}
        <p className="min-w-0 flex-1 truncate text-bar-title sm:hidden">{title}</p>
        <div className="hidden flex-1 sm:flex">
          <Link
            href="/"
            className="flex min-h-11 items-center rounded-lg px-1 text-primary focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Wordmark />
            <span className="sr-only">{t("home")}</span>
          </Link>
        </div>
        <div className="pr-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
