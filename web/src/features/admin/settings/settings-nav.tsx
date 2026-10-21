"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { adminHref, isReleased, settingsPages } from "../pages";

/**
 * The settings menu beside every settings page (Figma Admin/SettingsNav): one link per page from the registry, the
 * open one on the secondary wash, "Sắp có" on a page that is not open. On a phone it sits above the page.
 */
export function SettingsNav() {
  const t = useTranslations("admin.shell");
  const pathname = usePathname();

  return (
    <nav aria-label={t("settingsNav")} className="shrink-0 lg:w-60">
      <ul className="flex flex-col gap-1">
        {settingsPages.map((key) => {
          const href = adminHref(key);
          const open = pathname === href;
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={open ? "page" : undefined}
                className={cn(
                  buttonVariants({ variant: open ? "secondary" : "ghost" }),
                  "w-full justify-start",
                )}
              >
                <span className="min-w-0 flex-1 truncate text-left">{t(`pages.${key}.label`)}</span>
                {!isReleased(key) && <Badge variant="outline">{t("soon")}</Badge>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
