"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "home", path: "" },
  { key: "posts", path: "/offers" },
  { key: "catalog", path: "/catalog" },
  { key: "orders", path: "/orders" },
] as const;

// The store's four tabs in the header (Figma Q1: Trang chủ, Bài đăng, Danh mục, Đơn): the open one is a white
// pill with blue ink, the others white ink on the header. A tab is open on its own address and below it.
export function StoreNav({ sellerId }: { sellerId: string }) {
  const t = useTranslations("StoreNav");
  const pathname = usePathname();
  const base = `/stores/${sellerId}`;

  return (
    <nav aria-label={t("label")}>
      <ul className="flex items-center gap-1">
        {tabs.map(({ key, path }) => {
          const href = `${base}${path}`;
          const open = path === "" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={open ? "page" : undefined}
                className="group/tab flex min-h-11 items-center rounded-full focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span
                  className={cn(
                    "flex h-9 items-center rounded-full px-4 text-body-sm-strong whitespace-nowrap transition-colors",
                    open
                      ? "bg-card text-primary"
                      : "text-header-foreground group-hover/tab:bg-header-raised/20",
                  )}
                >
                  {t(key)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
