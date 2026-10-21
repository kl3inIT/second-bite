import {
  BanIcon,
  ChevronRightIcon,
  HourglassIcon,
  LifeBuoyIcon,
  StoreIcon,
  WalletIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { adminHref } from "@/features/admin/pages";
import { Link } from "@/i18n/navigation";

import type { PendingWork } from "./overview-source";

type Counts = PendingWork & { pendingSellers: number; blockedSellers: number };

const rows = [
  { key: "issues", icon: LifeBuoyIcon, href: adminHref("issues") },
  { key: "refunds", icon: WalletIcon, href: adminHref("payments") },
  { key: "pendingSellers", icon: StoreIcon, href: `${adminHref("sellers")}?status=pending` },
  { key: "blockedSellers", icon: BanIcon, href: `${adminHref("sellers")}?status=blocked` },
  { key: "documents", icon: HourglassIcon, href: adminHref("sellers") },
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
    <section aria-labelledby="overview-todo" className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>
            <h2 id="overview-todo">{t("title")}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            {shown.map(({ key, icon: Icon, href }) => (
              <Item key={key} render={<li />} variant="outline" size="sm">
                <ItemMedia variant="icon">
                  <Icon aria-hidden />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{t(key)}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <span className="font-display text-price-lg text-foreground">{counts[key]}</span>
                  <Link
                    href={href}
                    aria-label={t("viewLabel", { name: t(key) })}
                    className={buttonVariants({ variant: "link" })}
                  >
                    {t("view")}
                    <ChevronRightIcon aria-hidden data-icon="inline-end" />
                  </Link>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
      </Card>
    </section>
  );
}
