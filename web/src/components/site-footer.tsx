import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { Wordmark } from "./wordmark";

// The foot of every page from `md`: the wordmark and what Second Bite is, then the terms and the privacy policy,
// where Decree 52/2013 asks a shopping site to show them (SEC-32). On a phone they are in the account tab
// instead, as in Grab's and ShopeeFood's apps, and the bottom bar takes the foot of the screen. The company's
// details, contact and "for sellers" join it when they exist (docs/research/2026-10-19-desktop-home.md).
export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="mt-8 hidden border-t border-border md:block">
      <div className="mx-auto flex w-full max-w-5xl justify-between gap-8 px-4 pt-8 pb-6 xl:max-w-300">
        <div className="flex max-w-sm flex-col gap-2">
          <Link
            href="/"
            className="self-start rounded-lg text-primary focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Wordmark />
            <span className="sr-only">{t("home")}</span>
          </Link>
          <p className="text-body-sm text-muted-foreground">{t("tagline")}</p>
        </div>
        <nav aria-labelledby="footer-help" className="flex flex-col gap-1">
          <h2 id="footer-help" className="text-body-sm-strong text-foreground">
            {t("help")}
          </h2>
          <ul className="flex flex-col">
            <li>
              <Link
                href="/terms"
                className="inline-flex min-h-11 items-center text-body-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {t("terms")}
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="inline-flex min-h-11 items-center text-body-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {t("privacy")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
