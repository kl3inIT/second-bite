import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Wordmark } from "@/components/wordmark";

// The deep-leaf header of every customer page (Figma header): the wordmark and the language capsule, then
// what the page puts under them, on a shell with rounded bottom corners.
export function AppHeader({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Metadata");

  return (
    <header className="rounded-b-3xl bg-shell text-shell-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3.5 px-4 pt-3.5 pb-5">
        <div className="flex items-center justify-between gap-4">
          <Wordmark label={t("title")} className="block h-6 w-38" />
          <LanguageSwitcher />
        </div>
        {children}
      </div>
    </header>
  );
}
