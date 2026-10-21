import { useTranslations } from "next-intl";
import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import { AdminTopBar } from "@/features/admin/admin-top-bar";
import { getCurrentAccount } from "@/features/identity/current-account";
import { Link } from "@/i18n/navigation";

import SiteNotFound from "../not-found";

// An admin address no page answers (Figma AD-TT5), inside the frame for an admin; anyone else sees the
// site's own not-found page, so an admin page does not say it exists.
export default function AdminNotFound() {
  return (
    <Suspense>
      <ForCaller />
    </Suspense>
  );
}

async function ForCaller() {
  const account = await getCurrentAccount();
  return account?.role === "admin" ? <InFrame /> : <SiteNotFound />;
}

function InFrame() {
  const t = useTranslations("Admin");

  return (
    <>
      <AdminTopBar crumbs={[{ label: t("notFound.crumb") }]} />
      <div className="flex flex-1 flex-col items-center px-4 py-12 md:px-8">
        <div className="flex w-full max-w-136 flex-col items-center gap-3 rounded-2xl border border-border bg-card px-5 py-7 text-center text-card-foreground md:px-7 md:py-8">
          <h1 className="text-headline">{t("notFound.title")}</h1>
          <p className="text-body-sm text-muted-foreground">{t("notFound.body")}</p>
          <Link href="/admin" className={buttonVariants({ variant: "outline", className: "mt-1" })}>
            {t("notFound.back")}
          </Link>
        </div>
      </div>
    </>
  );
}
