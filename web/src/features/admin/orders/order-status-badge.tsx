import {
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  InfoIcon,
  type LucideIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { AdminBadge, type BadgeTone } from "../ui/badge";
import type { OrderStatus } from "./order";

const statuses: Record<OrderStatus, { tone: BadgeTone; icon: LucideIcon }> = {
  confirmed: { tone: "neutral", icon: ClockIcon },
  ready: { tone: "info", icon: InfoIcon },
  collected: { tone: "success", icon: CircleCheckIcon },
  expired: { tone: "warning", icon: TriangleAlertIcon },
  cancelled: { tone: "error", icon: CircleXIcon },
  rejected: { tone: "error", icon: CircleXIcon },
};

/** An order's state in words with its icon (Figma AD-DH1 › Trạng thái): "Sẵn sàng", "Hết hạn". */
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const t = useTranslations("admin.orders.status");
  const { tone, icon } = statuses[status];
  return (
    <AdminBadge tone={tone} icon={icon}>
      {t(status)}
    </AdminBadge>
  );
}
