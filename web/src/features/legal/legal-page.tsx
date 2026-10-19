import { ChevronLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppHeader } from "@/components/app-header";
import { Link } from "@/i18n/navigation";

type LegalSection = { title: string; paragraphs: string[] };

// The terms and the privacy policy: a draft notice, the date, the sections listed, then each section.
// Their text is in the catalogs under Terms and Privacy, one entry per section (SEC-32). The header leads
// back to the home.
export function LegalPage({ namespace }: { namespace: "Terms" | "Privacy" }) {
  const t = useTranslations(namespace);
  const legal = useTranslations("Legal");
  const home = useTranslations("Home");
  const sections = t.raw("sections") as LegalSection[];

  return (
    <>
      <AppHeader
        title={
          <Link
            href="/"
            className="-my-1.5 flex min-h-11 items-center gap-1.5 rounded-lg text-place-16 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ChevronLeftIcon aria-hidden className="size-5 shrink-0" />
            {home.rich("title", { hidden: (chunks) => <span className="sr-only">{chunks}</span> })}
          </Link>
        }
      />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4">
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-h2-22 text-foreground">{t("title")}</h1>
          <p role="note" className="rounded-xl bg-card p-4 text-body-14 text-card-foreground">
            {legal("draft")}
          </p>
          <p className="text-caption-12 text-foreground">{legal("updated")}</p>
          <p className="text-body-14 text-foreground">{t("intro")}</p>
        </header>
        <nav aria-labelledby="legal-contents">
          <h2 id="legal-contents" className="text-title-15 text-foreground">
            {legal("contents")}
          </h2>
          <ol className="mt-2 flex flex-col gap-1">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a
                  href={`#section-${index + 1}`}
                  className="inline-flex min-h-11 items-center text-body-14 text-foreground underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {sections.map((section, index) => (
          <section key={section.title} id={`section-${index + 1}`} className="flex flex-col gap-2">
            <h2 className="text-title-15 text-foreground">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-body-14 text-foreground">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </main>
    </>
  );
}
