import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

// The foot of every page from `md`: the terms and the privacy policy, where Decree 52/2013 asks a shopping
// site to show them (SEC-32). On a phone they are in the account tab instead, as in Grab's and ShopeeFood's
// apps, and the bottom bar takes the foot of the screen.
export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="mt-8 hidden border-t border-border md:block">
      <nav aria-label={t("label")} className="mx-auto w-full max-w-5xl px-4 py-2">
        <ul className="flex flex-wrap gap-x-6">
          <li>
            <Link
              href="/terms"
              className="inline-flex min-h-11 items-center text-body-sm text-foreground underline"
            >
              {t("terms")}
            </Link>
          </li>
          <li>
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center text-body-sm text-foreground underline"
            >
              {t("privacy")}
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
