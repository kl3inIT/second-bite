import { TriangleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { adminHref } from "@/features/admin/pages";
import { Link } from "@/i18n/navigation";

import type { SellerDuplicate } from "./review";

/**
 * A pending store that shares its phone or address with a store an admin blocked (Figma AD-DS2, SEC-65): one amber
 * line under the figures, and the blocked store a press away. The admin decides; nothing is refused for it.
 */
export function DuplicateAlert({ duplicate }: { duplicate: SellerDuplicate }) {
  const t = useTranslations("admin.sellers.detail.duplicate");
  return (
    <Alert variant="warning" className="flex flex-wrap items-center">
      <TriangleAlertIcon aria-hidden className="mr-2.5" />
      <AlertTitle className="mr-3 min-w-0 flex-1">
        {t(duplicate.match, { name: duplicate.name })}
      </AlertTitle>
      <Link
        href={adminHref("sellerDetail", { sellerId: duplicate.sellerId })}
        className={buttonVariants({ variant: "secondary" })}
      >
        {t("view", { name: duplicate.name })}
      </Link>
    </Alert>
  );
}
