import { useTranslations } from "next-intl";

import { AppHeader } from "@/components/app-header";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

// An address no page answers, drawn as Figma's seller screens (SEC-52): the header, then one card with what
// happened and the way home. Next.js answers it with 404 and `noindex`, so search engines drop it.
export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <>
      <AppHeader />
      <main className="flex flex-1 flex-col items-center px-4 pt-2 pb-12 md:pt-6">
        <div className="flex w-full max-w-136 flex-col items-center gap-4 rounded-2xl border border-border bg-card px-5 py-7 text-center text-card-foreground md:px-7 md:py-8">
          <h1 className="text-headline">{t("title")}</h1>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            {t("back")}
          </Link>
        </div>
      </main>
    </>
  );
}
