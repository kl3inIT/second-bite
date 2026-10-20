import { InboxIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

import { AdminNotFoundCrumb } from "./admin-crumbs";
import { adminHref } from "./pages";

// An admin address that answers nothing, for an admin (Figma AD-TT5 228:11690): the sidebar and the top bar
// stay, the breadcrumb reads "Quản trị / Không tìm thấy", and one card says so and leads back to the overview.
// Someone who is not an admin never sees it: the admin layout gives them the customer's not-found page.
export function AdminNotFound() {
  const t = useTranslations("admin.shell.notFound");

  return (
    <section className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-8 py-14 text-center">
      <AdminNotFoundCrumb />
      <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
        <InboxIcon aria-hidden className="size-6" />
      </span>
      <h1 className="text-headline text-foreground">{t("title")}</h1>
      <Link href={adminHref("overview")} className={buttonVariants()}>
        {t("back")}
      </Link>
    </section>
  );
}
