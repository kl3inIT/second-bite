import {
  BanIcon,
  ChevronRightIcon,
  HourglassIcon,
  LifeBuoyIcon,
  StoreIcon,
  WalletIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { adminHref } from "@/features/admin/pages";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import type { PendingWork } from "./overview-source";

type Counts = PendingWork & { pendingSellers: number; blockedSellers: number };

const rows = [
  {
    key: "issues",
    icon: LifeBuoyIcon,
    tile: "bg-destructive-muted text-destructive",
    href: adminHref("issues"),
  },
  {
    key: "refunds",
    icon: WalletIcon,
    tile: "bg-warning text-warning-foreground",
    href: adminHref("payments"),
  },
  {
    key: "pendingSellers",
    icon: StoreIcon,
    tile: "bg-secondary text-primary",
    href: `${adminHref("sellers")}?status=pending`,
  },
  {
    key: "blockedSellers",
    icon: BanIcon,
    tile: "bg-destructive-muted text-destructive",
    href: `${adminHref("sellers")}?status=blocked`,
  },
  {
    key: "documents",
    icon: HourglassIcon,
    tile: "bg-warning text-warning-foreground",
    href: adminHref("sellers"),
  },
] as const;

/**
 * What waits for an admin (Figma AD-TQ1 › Card · Cần xử lý): one row per kind of work with its icon, its count and
 * "Xem ›" to the list. Only the rows the backend can count are shown: the stores awaiting approval and the blocked
 * ones; problem reports, refunds and documents join when their modules exist (their count is null until then).
 */
export function TodoCard({ counts }: { counts: Counts }) {
  const t = useTranslations("admin.overview.todo");
  const shown = rows.filter((row) => counts[row.key] !== null);

  return (
    <section
      aria-labelledby="overview-todo"
      className="flex h-full flex-col gap-1 rounded-2xl border border-border bg-card px-6 pt-6 pb-4"
    >
      <h2 id="overview-todo" className="text-title-lg text-foreground">
        {t("title")}
      </h2>
      <ul className="flex flex-col">
        {shown.map(({ key, icon: Icon, tile, href }) => (
          <li key={key} className="flex items-center gap-3 border-t border-border py-3">
            <span
              className={cn("flex size-10 shrink-0 items-center justify-center rounded-md", tile)}
            >
              <Icon aria-hidden className="size-5" />
            </span>
            <span className="min-w-0 flex-1 text-body-sm-strong text-foreground">{t(key)}</span>
            <span className="font-display text-price-lg text-foreground">{counts[key]}</span>
            <Link
              href={href}
              aria-label={t("viewLabel", { name: t(key) })}
              className="-mr-0.5 inline-flex min-h-11 items-center gap-0.5 rounded-sm pr-0.5 pl-2 text-body-sm-strong text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {t("view")}
              <ChevronRightIcon aria-hidden className="size-4" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
