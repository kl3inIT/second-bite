"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { usePathname } from "@/i18n/navigation";

import { AdminCrumbsProvider, useAdminCrumbs } from "./admin-crumbs";
import { type Crumb, AdminTopBar } from "./admin-top-bar";
import { adminHref, type AdminNamedPage, adminPages, lineage, matchAdminPage } from "./pages";

// The frame of the SEC-62 pages inside SEC-75's admin layout: SEC-75's top bar with the trail read from the
// address through the page registry, a detail page's own name at its end (AdminCrumb), then the page, 24px by
// 32px around it and 20px between its blocks. What a page puts beside its title (AdminTopBarActions) sits at
// the top of the page.
export function AdminPageFrame({ children }: { children: ReactNode }) {
  return (
    <AdminCrumbsProvider>
      <PageBar />
      <div className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-8">
        <PageActions />
        {children}
      </div>
    </AdminCrumbsProvider>
  );
}

function PageActions() {
  const { setActions } = useAdminCrumbs();
  return <div ref={setActions} className="flex items-center justify-end gap-3 empty:hidden" />;
}

function PageBar() {
  const t = useTranslations("admin.shell");
  const { trail } = useAdminCrumbs();
  const current = matchAdminPage(usePathname());

  const crumbs: Crumb[] = [];
  if (!current) {
    crumbs.push({ label: t("title") }, { label: t("notFound.crumb") });
  } else {
    const section = adminPages[current].section;
    crumbs.push({ label: section === "admin" ? t("title") : t(`groups.${section}`) });
    const named = lineage(current)
      .toReversed()
      .filter((key): key is AdminNamedPage => !key.endsWith("Detail"))
      // A settings page's trail is "Cài đặt / Bài đăng": the section already names the settings.
      .filter((key) => !(section === "settings" && key === "settings"));
    for (const key of named) {
      crumbs.push({ label: t(`pages.${key}.label`), href: adminHref(key) });
    }
    if (current.endsWith("Detail")) {
      // A detail page names itself through AdminCrumb; until it does, its name in the catalog stands in
      // ("Sửa banner"), when it has one. Only some detail pages have such a name, so it is checked at run time.
      const loose = t as unknown as { has(key: string): boolean; (key: string): string };
      const fallback = `pages.${current}.label`;
      const last = trail.last ?? (loose.has(fallback) ? loose(fallback) : undefined);
      if (last) crumbs.push({ label: last });
    }
  }

  return <AdminTopBar crumbs={crumbs} />;
}
