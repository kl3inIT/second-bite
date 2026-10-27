import {
  CircleCheckIcon,
  ClockIcon,
  TriangleAlertIcon,
  Undo2Icon,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

import type { OfferStatus } from "./search-params";

/** Each status's tone and icon, on the badge and on its card (Figma AD-BD1): never colour alone. */
export const statusLook: Record<
  OfferStatus,
  { variant: "success" | "warning" | "neutral"; icon: LucideIcon }
> = {
  on_sale: { variant: "success", icon: CircleCheckIcon },
  sold_out: { variant: "warning", icon: TriangleAlertIcon },
  closed: { variant: "neutral", icon: ClockIcon },
  withdrawn: { variant: "neutral", icon: Undo2Icon },
};

export function OfferStatusBadge({ status }: { status: OfferStatus }) {
  const t = useTranslations("Admin.offers.status");
  const { variant, icon: Icon } = statusLook[status];

  return (
    <Badge variant={variant}>
      <Icon data-icon="inline-start" aria-hidden />
      {t(status)}
    </Badge>
  );
}
