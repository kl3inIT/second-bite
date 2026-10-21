"use client";

import { MailIcon, PackageIcon, ShieldUserIcon, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { isWithin } from "./nav";

/** The settings' pages, in the order of Figma's Admin/SettingsNav; a page joins with its screen. */
export const settingsPages: Array<{
  key: "offers" | "email" | "admins";
  href: "/admin/settings/offers" | "/admin/settings/email" | "/admin/settings/admins";
  icon: LucideIcon;
}> = [
  // The offer settings and the admins are SEC-62's pages.
  { key: "offers", href: "/admin/settings/offers", icon: PackageIcon },
  { key: "email", href: "/admin/settings/email", icon: MailIcon },
  { key: "admins", href: "/admin/settings/admins", icon: ShieldUserIcon },
];

// The settings' own menu beside the page (Figma Admin/SettingsNav): a framed list, the page open tinted.
export function SettingsNav() {
  const t = useTranslations("Admin.settings");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("nav")}
      className="rounded-2xl border border-border bg-card p-2 md:w-60 md:self-start"
    >
      <ul className="flex gap-0.5 md:flex-col">
        {settingsPages.map(({ key, href, icon: Icon }) => {
          const current = isWithin(pathname, href);
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center gap-2.5 rounded-xl px-3 text-body-sm text-foreground hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  current &&
                    "bg-secondary text-body-sm-strong text-secondary-foreground hover:bg-secondary",
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                {t(key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
