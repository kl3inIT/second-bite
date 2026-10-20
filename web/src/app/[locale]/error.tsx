"use client";

import { useTranslations } from "next-intl";

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";

// Safe words, Next's digest as the reference a person reports (matched to the server's
// web.render.failed log line), and a retry that fetches the page's data again; under the header and in one
// card, as Figma's seller screens (SEC-52). A failure is no page to index.
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  const t = useTranslations("Error");
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : undefined;

  return (
    <>
      <meta name="robots" content="noindex" />
      <AppHeader />
      <main className="flex flex-1 flex-col items-center px-4 pt-6 pb-12 md:pt-10">
        <div className="flex w-full max-w-136 flex-col items-center gap-3 rounded-2xl border border-border bg-card px-5 py-7 text-center text-card-foreground md:px-7 md:py-8">
          <h1 className="text-headline">{t("title")}</h1>
          <p className="text-body-sm">{t("body")}</p>
          {digest && (
            <p className="text-label text-muted-foreground">{t("reference", { digest })}</p>
          )}
          <Button className="mt-1" onClick={() => retry()}>
            {t("retry")}
          </Button>
        </div>
      </main>
    </>
  );
}
