import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <h1 className="font-display text-h1-28 text-foreground">{t("title")}</h1>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        {t("back")}
      </Link>
    </main>
  );
}
