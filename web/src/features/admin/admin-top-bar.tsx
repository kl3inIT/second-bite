"use client";

import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSidebar } from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";

import { useAdminCrumbs } from "./admin-crumbs";
import { adminHref, type AdminNamedPage, adminPages, lineage, matchAdminPage } from "./pages";

type Crumb = { label: string; href?: string };

// The bar over every admin page (Figma Admin/TopBar 228:6039): the breadcrumb, "Vận hành / Cửa hàng", read
// from the address through the page registry, a detail page's name at its end, and on the right whatever the
// page puts there (AdminTopBarActions). On a phone it opens the sidebar's drawer.
export function AdminTopBar() {
  const t = useTranslations("admin.shell");
  const { toggleSidebar } = useSidebar();
  const { trail, setActions } = useAdminCrumbs();
  const current = matchAdminPage(usePathname());

  const crumbs: Crumb[] = [];
  if (!current || trail.notFound) {
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
    if (current.endsWith("Detail") && trail.last) crumbs.push({ label: trail.last });
  }
  const last = crumbs.length - 1;

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 md:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={t("sidebar.open")}
          className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-lg text-foreground hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none md:hidden"
        >
          <MenuIcon aria-hidden className="size-5" />
        </button>
        <Breadcrumb aria-label={t("breadcrumb")} className="min-w-0">
          <BreadcrumbList>
            {crumbs.map((crumb, index) => (
              <Fragment key={`${index}-${crumb.label}`}>
                {index > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
                <BreadcrumbItem>
                  {index === last ? (
                    <BreadcrumbPage variant="strong">{crumb.label}</BreadcrumbPage>
                  ) : crumb.href ? (
                    <BreadcrumbLink render={<Link href={crumb.href} />}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div ref={setActions} className="flex shrink-0 items-center gap-3 empty:hidden" />
    </header>
  );
}
