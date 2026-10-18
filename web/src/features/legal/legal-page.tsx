import { useTranslations } from "next-intl";

import { TopBar } from "@/components/top-bar";

type LegalSection = { title: string; paragraphs: string[] };

// The terms and the privacy policy: a draft notice, the date, the sections listed, then each section.
// Their text is in the catalogs under Terms and Privacy, one entry per section (SEC-32).
export function LegalPage({ namespace }: { namespace: "Terms" | "Privacy" }) {
  const t = useTranslations(namespace);
  const legal = useTranslations("Legal");
  const sections = t.raw("sections") as LegalSection[];

  return (
    <>
      <TopBar />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4">
        <header className="flex flex-col gap-3">
          <h1 className="text-headline text-foreground">{t("title")}</h1>
          <p role="note" className="rounded-xl bg-card p-4 text-body-sm text-card-foreground">
            {legal("draft")}
          </p>
          <p className="text-label text-muted-foreground">{legal("updated")}</p>
          <p className="text-body text-foreground">{t("intro")}</p>
        </header>
        <nav aria-labelledby="legal-contents">
          <h2 id="legal-contents" className="text-title text-foreground">
            {legal("contents")}
          </h2>
          <ol className="mt-2 flex flex-col gap-1">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a
                  href={`#section-${index + 1}`}
                  className="inline-flex min-h-11 items-center text-body text-foreground underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {sections.map((section, index) => (
          <section key={section.title} id={`section-${index + 1}`} className="flex flex-col gap-2">
            <h2 className="text-title text-foreground">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-body text-foreground">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </main>
    </>
  );
}
