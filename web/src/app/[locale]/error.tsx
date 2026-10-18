"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = useTranslations("Error");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-headline text-foreground">{t("title")}</h1>
      <Button onClick={reset}>{t("retry")}</Button>
    </main>
  );
}
