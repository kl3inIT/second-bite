import { ChevronLeftIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { contentWidth } from "@/lib/layout";
import { cn } from "@/lib/utils";

import { LanguageSwitcher } from "./language-switcher";
import { Wordmark } from "./wordmark";

// What the top bar draws, with its two phrases handed in, so a client component can draw it with its own
// translations (the store's pushed screens, which learn the address in the browser).
export function TopBarView({
  title,
  back,
  backLabel,
  homeLabel,
}: {
  title: string;
  back?: string;
  backLabel: string;
  homeLabel: string;
}) {
  return (
    <header className="border-b border-border bg-shell text-shell-foreground">
      <div className={cn(contentWidth, "flex h-14 items-center gap-2 px-2")}>
        {back ? (
          <Link
            href={back}
            aria-label={backLabel}
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
            <span className="sr-only">{homeLabel}</span>
          </Link>
        </div>
        <div className="pr-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

// The white top bar of every screen but the home (DESIGN.md › White Shell, Figma "Top bar"): back to where
// the person came from (a tab's own screen has no back), the screen's name on a phone or the wordmark on a wide screen (Figma W1, W2), and
// the language. Screens carry no large title of their own.
export async function TopBar({ title, back }: { title: string; back?: string }) {
  const t = await getTranslations("TopBar");

  return <TopBarView title={title} back={back} backLabel={t("back")} homeLabel={t("home")} />;
}
