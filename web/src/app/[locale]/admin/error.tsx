"use client";

import { CircleAlertIcon, RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { type AdminNamedPage, matchAdminPage } from "@/features/admin/pages";
import { PageHeader } from "@/features/admin/ui/page-header";
import { usePathname } from "@/i18n/navigation";

// An admin page whose data could not be read (Figma AD-TT4 228:10364): the shell stays, the page keeps its
// title, and one card says so with "Thử lại", which reads the page again. No reference and no description line
// (the admin has no subtitles); Next's digest, which the server's web.render.failed line carries, goes to the
// console for whoever is looking.
export default function AdminError({ error, retry }: { error: unknown; retry: () => void }) {
  const t = useTranslations("admin.shell");
  const current = matchAdminPage(usePathname());
  // A page with a name of its own keeps its title over the card; a detail page has none to give.
  const named = current && !current.endsWith("Detail") ? (current as AdminNamedPage) : undefined;
  const Title = named ? "h2" : "h1";
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : undefined;

  useEffect(() => {
    if (digest) console.error(`web.render.failed digest=${digest}`);
  }, [digest]);

  return (
    <>
      {named && <PageHeader title={t(`pages.${named}.label`)} />}
      <section className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-8 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <CircleAlertIcon aria-hidden className="size-6" />
        </span>
        <Title className="text-title text-foreground">{t("error.title")}</Title>
        <Button onClick={() => retry()}>
          <RotateCcwIcon data-icon="inline-start" aria-hidden />
          {t("error.retry")}
        </Button>
      </section>
    </>
  );
}
