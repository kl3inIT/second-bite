import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { pageMetadata } from "@/lib/seo";

import { type AdminNamedPage, type AdminPageKey, adminPages, isReleased, lineage } from "./pages";

/**
 * A page's flag at work: an open page renders its content; one whose `released` is off in the registry (pages.ts)
 * renders the shared coming-soon page instead, its code kept. Every admin page wraps its content in it:
 *
 *   export default function OrdersPage() {
 *     return <AdminPageGate page="orders"><Orders /></AdminPageGate>;
 *   }
 *
 * A detail page names its own key (`orderDetail`) and shows the coming-soon page of its parent when closed.
 */
export function AdminPageGate({ page, children }: { page: AdminPageKey; children: ReactNode }) {
  if (isReleased(page)) return children;
  const named = lineage(page).find((key): key is AdminNamedPage => !key.endsWith("Detail"));
  return <ComingSoon page={named ?? "overview"} />;
}

// The page of a menu item that is not open yet (AD-TT6): the page's icon, "Sắp có" and its name, nothing to press.
// It shows inside the shell and, for a settings page, inside the settings layout, so the item can still be chosen.
function ComingSoon({ page }: { page: AdminNamedPage }) {
  const t = useTranslations("admin.shell");
  const Icon = adminPages[page].icon;
  return (
    <section aria-labelledby="coming-soon-title" className="flex flex-1 flex-col">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon aria-hidden />
          </EmptyMedia>
          <Badge variant="secondary">{t("soon")}</Badge>
          <EmptyTitle>
            <h1 id="coming-soon-title">{t(`pages.${page}.label`)}</h1>
          </EmptyTitle>
        </EmptyHeader>
      </Empty>
    </section>
  );
}

/**
 * An admin page's metadata: its name from the registry's catalog, or `title` for a detail page, and never indexed
 * (the admin pages are not in the sitemap either).
 */
export async function adminMetadata(
  params: Promise<{ locale: string }>,
  page: AdminNamedPage | { title: string },
): Promise<Metadata> {
  const [{ locale }, t] = await Promise.all([params, getTranslations("admin.shell")]);
  const title = typeof page === "string" ? t(`pages.${page}.label`) : page.title;
  return pageMetadata({ locale, title: `${title} · ${t("title")}`, index: false });
}
