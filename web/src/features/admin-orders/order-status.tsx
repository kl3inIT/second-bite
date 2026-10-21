import {
  BanIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  PackageCheckIcon,
  TimerOffIcon,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

import type { OrderStatus } from "./search-params";

/** Each status's tone and icon, on the badge and on its card (Figma AD-DH1): never colour alone. */
export const statusLook: Record<
  OrderStatus,
  { variant: "success" | "warning" | "danger" | "info" | "neutral"; icon: LucideIcon }
> = {
  confirmed: { variant: "info", icon: ClockIcon },
  ready: { variant: "warning", icon: PackageCheckIcon },
  collected: { variant: "success", icon: CircleCheckIcon },
  cancelled: { variant: "neutral", icon: CircleXIcon },
  refused: { variant: "danger", icon: BanIcon },
  expired: { variant: "neutral", icon: TimerOffIcon },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const t = useTranslations("Admin.orders.status");
  const { variant, icon: Icon } = statusLook[status];

  return (
    <Badge variant={variant}>
      <Icon data-icon="inline-start" aria-hidden />
      {t(status)}
    </Badge>
  );
}
