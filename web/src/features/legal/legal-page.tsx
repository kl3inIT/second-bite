import type { Metadata } from "next";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { JsonLd } from "@/components/json-ld";
import { AccountAction } from "@/features/identity/account-action";
import { contentWidth } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { absoluteUrl, pageMetadata, siteIds } from "@/lib/seo";
import { Panel } from "@/components/panel";
import { Card, CardContent } from "@/components/ui/card";

import { legalUpdated } from "./legal";

type LegalSection = { title: string; paragraphs: string[] };
type Namespace = "Terms" | "Privacy";

const paths = { Terms: "/terms", Privacy: "/privacy" } as const;

/** The page's title, description, canonical address and its other language, for search engines. */
export async function legalMetadata(namespace: Namespace, locale: string): Promise<Metadata> {
  const t = await getTranslations(namespace);
  return pageMetadata({
    locale,
    path: paths[namespace],
    title: t("title"),
    description: t("description"),
  });
}

// The terms and the privacy policy (SEC-32), drawn as Figma's seller screens (SEC-52): the header with the
// wordmark and the language, the heading, the draft notice, then the text in one card: the date, the
// introduction, the sections listed and each section under its own heading, which a search or answer engine
// can link to and quote. Their text is in the catalogs under Terms and Privacy, one entry per section.
export function LegalPage({ namespace }: { namespace: Namespace }) {
  const t = useTranslations(namespace);
  const legal = useTranslations("Legal");
  const site = useTranslations("Metadata");
  const format = useFormatter();
  const locale = useLocale();
  const sections = t.raw("sections") as LegalSection[];
  const url = absoluteUrl(locale, paths[namespace]);

  return (
    <>
      <AppHeader
        account={
          <Suspense>
            <AccountAction returnTo={paths[namespace]} />
          </Suspense>
        }
      />
      <main
        className={cn(contentWidth, "flex flex-1 flex-col gap-4 px-4 pt-2 pb-12 md:gap-6 md:pt-6")}
      >
        <header className="flex flex-col gap-4 md:w-full md:max-w-3xl md:self-center">
          <h1 className="text-headline text-foreground">{t("title")}</h1>
          <Card size="page" role="note">
            <CardContent>{legal("draft")}</CardContent>
          </Card>
        </header>
        <Panel
          as="article"
          className="md:w-full md:max-w-3xl md:self-center"
          contentClassName="gap-6"
        >
          <div className="flex flex-col gap-3">
            <p className="text-label text-muted-foreground">
              {legal.rich("updated", {
                date: format.dateTime(new Date(legalUpdated), "date"),
                time: (chunks) => <time dateTime={legalUpdated}>{chunks}</time>,
              })}
            </p>
            <p className="text-body-sm">{t("intro")}</p>
          </div>
          <nav aria-labelledby="legal-contents">
            <h2 id="legal-contents" className="text-title">
              {legal("contents")}
            </h2>
            <ol className="mt-2 flex flex-col">
              {sections.map((section, index) => (
                <li key={section.title}>
                  <a
                    href={`#section-${index + 1}`}
                    className="inline-flex min-h-11 items-center text-body-sm text-link underline underline-offset-4"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          {sections.map((section, index) => (
            <section
              key={section.title}
              id={`section-${index + 1}`}
              aria-labelledby={`section-${index + 1}-title`}
              className="flex scroll-mt-4 flex-col gap-2"
            >
              <h2 id={`section-${index + 1}-title`} className="text-title">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-body-sm">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </Panel>
        {/* The page, its place under the home, and its sections as parts an answer engine can cite. */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${url}#webpage`,
            url,
            name: t("title"),
            description: t("description"),
            inLanguage: locale,
            dateModified: legalUpdated,
            isPartOf: { "@id": siteIds.website },
            publisher: { "@id": siteIds.organization },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: site("title"),
                  item: absoluteUrl(locale),
                },
                { "@type": "ListItem", position: 2, name: t("title"), item: url },
              ],
            },
            hasPart: sections.map((section, index) => ({
              "@type": "WebPageElement",
              name: section.title,
              url: `${url}#section-${index + 1}`,
              text: section.paragraphs.join(" "),
            })),
          }}
        />
      </main>
    </>
  );
}
