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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";

export type Crumb = { label: string; href?: "/admin/audit" };

// The bar over every admin page (Figma Admin/TopBar, 228:6039): white with a hairline below, and where the
// page sits, its own name last. On a phone the sidebar is a sheet, so the bar carries its trigger.
export function AdminTopBar({ crumbs }: { crumbs: Crumb[] }) {
  const t = useTranslations("Admin");

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-shell px-4 text-shell-foreground md:px-8">
      <SidebarTrigger label={t("menu")} className="-ms-2 md:hidden" />
      <Breadcrumb aria-label={t("breadcrumb")}>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => (
            <Fragment key={crumb.label}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === crumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : crumb.href ? (
                  <BreadcrumbLink render={<Link href={crumb.href} />}>{crumb.label}</BreadcrumbLink>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
