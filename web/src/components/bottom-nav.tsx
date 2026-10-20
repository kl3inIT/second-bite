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
};

// The four tabs of the customer screens on a phone (DESIGN.md › Bottom bar, Figma "Bottom nav", 105:2515),
// floating 16px from the sides and the bottom. Orders and saved sellers have no screen yet (SEC-15,
// following), so their tabs are shown dimmed and cannot be pressed. From `md` the header and the footer
// take over, and the bar is not shown.
const tabs: Tab[] = [
  { key: "home", icon: HouseIcon, href: "/" },
  { key: "orders", icon: ReceiptTextIcon },
  { key: "saved", icon: HeartIcon },
  { key: "account", icon: UserRoundIcon, href: "/account" },
];

export function BottomNav() {
  const t = useTranslations("BottomNav");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("label")}
      className="fixed inset-x-4 bottom-safe-4 z-40 mx-auto max-w-md rounded-full border border-card/90 bg-linear-to-b from-card/80 to-card/60 p-1.25 text-shell-foreground shadow-nav backdrop-blur-xl md:hidden"
    >
      <ul className="grid h-13.5 grid-cols-4">
        {tabs.map(({ key, icon: Icon, href }) => {
          const active = href === pathname;
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
                  aria-current={active ? "page" : undefined}
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
                  className="flex flex-1 cursor-not-allowed flex-col items-center justify-center gap-1 text-muted-foreground opacity-60"
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
  );
}
