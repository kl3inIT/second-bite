"use client";

import {
  HeartIcon,
  HouseIcon,
  ReceiptTextIcon,
  UserRoundIcon,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Tab = {
  key: "home" | "orders" | "saved" | "account";
  icon: LucideIcon;
  href?: "/" | "/account";
  // Other pages that belong to the tab, as the search belongs to the home.
  within?: readonly string[];
};

// The four tabs of the customer screens on a phone (DESIGN.md › Bottom bar, Figma "Bottom nav", 105:2515),
// floating 16px from the sides and the bottom. Orders and saved sellers have no screen yet (SEC-15,
// following), so their tabs are shown dimmed and cannot be pressed. Every page has it, after a space as
// tall as the bar so the bar never covers the page's end. From `md` the header and the footer take over,
// and the bar is not shown.
const tabs: Tab[] = [
  { key: "home", icon: HouseIcon, href: "/", within: ["/search"] },
  { key: "orders", icon: ReceiptTextIcon },
  { key: "saved", icon: HeartIcon },
  {
    key: "account",
    icon: UserRoundIcon,
    href: "/account",
    within: ["/account/settings", "/delete-account"],
  },
];

export function BottomNav() {
  const t = useTranslations("BottomNav");
  const pathname = usePathname();
  // The admin's pages have their own sidebar instead (SEC-75 › Shell).
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;

  return (
    <>
      <div aria-hidden className="h-24 shrink-0 md:hidden" />
      <nav
        aria-label={t("label")}
        className="fixed inset-x-4 bottom-safe-4 z-40 mx-auto max-w-md rounded-full border border-card/60 bg-card/45 p-1.25 text-shell-foreground shadow-nav backdrop-blur-xl backdrop-saturate-180 md:hidden"
      >
        <ul className="grid h-13.5 grid-cols-4">
          {tabs.map(({ key, icon: Icon, href, within = [] }) => {
            const active = href === pathname || within.includes(pathname);
            const body = (
              <>
                <Icon aria-hidden className="size-5" />
                <span className={active ? "text-label-strong" : "text-label"}>{t(key)}</span>
              </>
            );
            return (
              <li key={key} className="flex">
                {href ? (
                  <Link
                    href={href}
                    aria-current={href === pathname ? "page" : active ? "true" : undefined}
                    className={cn(
                      "flex flex-1 flex-col items-center justify-center gap-1 rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset",
                      active
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {body}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="flex flex-1 cursor-not-allowed flex-col items-center justify-center gap-1 text-muted-foreground opacity-85"
                  >
                    {body}
                    <span className="sr-only">{t("soon")}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
