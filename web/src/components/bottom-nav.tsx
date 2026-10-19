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

// The four tabs of the customer screens on a phone (Figma "Bottom nav", 51:2501). Orders and saved sellers
// have no screen yet (SEC-15, following), so their tabs are shown but cannot be pressed. From `md` the
// header and the footer take over, and the bar is not shown.
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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-shell pb-safe text-shell-foreground md:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-4">
        {tabs.map(({ key, icon: Icon, href }) => {
          const active = href === pathname;
          const body = (
            <>
              <span
                className={cn(
                  "flex h-8 w-14 items-center justify-center rounded-full transition-colors",
                  active && "bg-fresh text-fresh-foreground",
                )}
              >
                <Icon aria-hidden className="size-5" />
              </span>
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
                    "flex flex-1 flex-col items-center justify-center gap-0.5 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {body}
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="flex flex-1 cursor-not-allowed flex-col items-center justify-center gap-0.5 text-muted-foreground opacity-50"
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
