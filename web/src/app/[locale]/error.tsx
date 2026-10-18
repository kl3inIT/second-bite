"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

// Safe words, Next's digest as the reference a person reports (matched to the server's
// web.render.failed log line), and a retry that fetches the page's data again.
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  const t = useTranslations("Error");
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : undefined;

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-headline text-foreground">{t("title")}</h1>
      <p className="text-body text-foreground">{t("body")}</p>
      {digest && <p className="text-body-sm text-foreground">{t("reference", { digest })}</p>}
      <Button onClick={() => retry()}>{t("retry")}</Button>
    </main>
  );
}
