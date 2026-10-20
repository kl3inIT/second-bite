import { useTranslations } from "next-intl";

import { type AdminNamedPage, adminPages } from "../pages";
import { AdminBadge } from "./badge";

// The page of a menu item that is not open yet (Figma Admin/ComingSoon 238:49518, AD-TT6): one card with the
// page's icon in a circle, "Sắp có" and the page's name; no action and no description. The sidebar and the top
// bar stay, so the item can still be chosen. A page shows it through AdminPageGate when its flag is off.
export function AdminComingSoon({ page }: { page: AdminNamedPage }) {
  const t = useTranslations("admin.shell");
  const Icon = adminPages[page].icon;

  return (
    <section className="flex min-h-160 flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-8 py-30 text-center">
      <span className="flex size-24 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon aria-hidden className="size-11" strokeWidth={1.5} />
      </span>
      <AdminBadge tone="neutral">{t("soon")}</AdminBadge>
      <h1 className="text-headline text-foreground">{t(`pages.${page}.label`)}</h1>
    </section>
  );
}
