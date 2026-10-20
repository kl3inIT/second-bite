import { useTranslations } from "next-intl";

import { AdminBadge } from "../ui/badge";
import { type OfferStatus, statusLook } from "./offer";

/** A post's status in words with its icon (Figma AD-BD1): "Đang bán", "Đã gỡ", "Gỡ do vi phạm". */
export function OfferStatusBadge({ status }: { status: OfferStatus }) {
  const t = useTranslations("admin.offers.status");
  const { tone, icon } = statusLook(status);
  return (
    <AdminBadge tone={tone} icon={icon}>
      {t(status)}
    </AdminBadge>
  );
}
