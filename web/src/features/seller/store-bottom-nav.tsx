"use client";

import {
  HouseIcon,
  MegaphoneIcon,
  ReceiptTextIcon,
  UtensilsIcon,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { isTabOpen, storeTabs } from "./store-tabs";

const icons: Record<(typeof storeTabs)[number]["key"], LucideIcon> = {
  home: HouseIcon,
  posts: MegaphoneIcon,
  catalog: UtensilsIcon,
  orders: ReceiptTextIcon,
};

// The store's four tabs on a phone (Figma "Bottom nav · Chủ quán"): the floating bar of the customer screens,
// 16px from the sides and the bottom, with the open tab in a pale pill. A space as tall as the bar ends the page so
// the bar never covers it. From `md` the header carries the tabs and the bar is not shown; a pushed screen has none.
export function StoreBottomNav() {
  const t = useTranslations("StoreNav");
  const pathname = usePathname();
  const base = pathname.split("/").slice(0, 3).join("/");

  return (
    <div className="group-data-[screen=push]/store:hidden md:hidden">
      <div aria-hidden className="h-24 shrink-0" />
      <nav
        aria-label={t("label")}
        className="fixed inset-x-4 bottom-safe-4 z-40 mx-auto max-w-md rounded-full border border-card/60 bg-card/45 p-1.25 text-shell-foreground shadow-nav backdrop-blur-xl backdrop-saturate-180"
      >
        <ul className="grid h-13.5 grid-cols-4">
          {storeTabs.map(({ key, path }) => {
            const open = isTabOpen(pathname, base, path);
            const Icon = icons[key];
            return (
              <li key={key} className="flex">
                <Link
                  href={`${base}${path}`}
                  aria-current={open ? "page" : undefined}
                  className={cn(
                    "flex flex-1 flex-col items-center justify-center gap-1 rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset",
                    open
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon aria-hidden className="size-5" />
                  <span className={open ? "text-label-strong" : "text-label"}>{t(key)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
