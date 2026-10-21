import { InboxIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Link } from "@/i18n/navigation";

import { AdminNotFoundCrumb } from "./admin-crumbs";
import { adminHref } from "./pages";

// An admin address that answers nothing, for an admin (Figma AD-TT5 228:11690): the sidebar and the top bar
// stay, the breadcrumb reads "Quản trị / Không tìm thấy", and the page says so and leads back to the overview.
// Someone who is not an admin never sees it: the admin layout gives them the customer's not-found page.
export function AdminNotFound() {
  const t = useTranslations("admin.shell.notFound");

  return (
    <Empty>
      <AdminNotFoundCrumb />
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon aria-hidden />
        </EmptyMedia>
        <EmptyTitle>
          <h1>{t("title")}</h1>
        </EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Link href={adminHref("overview")} className={buttonVariants()}>
          {t("back")}
        </Link>
      </EmptyContent>
    </Empty>
  );
}
