"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

// A failed admin page (Figma AD-TT4): the sidebar stays, since the boundary sits inside the frame, and the
// card says so in safe words, with Next's digest as the reference to report and a retry.
export default function AdminError({ error, retry }: { error: unknown; retry: () => void }) {
  const t = useTranslations("Error");
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : undefined;

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-12 md:px-8">
      <div className="flex w-full max-w-136 flex-col items-center gap-3 rounded-2xl border border-border bg-card px-5 py-7 text-center text-card-foreground md:px-7 md:py-8">
        <h1 className="text-headline">{t("title")}</h1>
        <p className="text-body-sm">{t("body")}</p>
        {digest && <p className="text-label text-muted-foreground">{t("reference", { digest })}</p>}
        <Button className="mt-1" onClick={() => retry()}>
          {t("retry")}
        </Button>
      </div>
    </div>
  );
}
