import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/language-switcher";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
      <LanguageSwitcher />
      <h1 className="text-display text-foreground">Second Bite</h1>
      <p className="text-body text-foreground">{t("tagline")}</p>
    </main>
  );
}
