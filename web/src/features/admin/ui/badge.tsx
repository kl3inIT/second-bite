import {
  BanIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  InfoIcon,
  type LucideIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

export type BadgeTone = "success" | "warning" | "error" | "info" | "neutral";

const toneIcons: Record<BadgeTone, LucideIcon> = {
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  error: CircleXIcon,
  info: InfoIcon,
  neutral: ClockIcon,
};

/**
 * A status in words with its icon (Figma Admin/Badge 228:21264): "Hoàn tất", "Chờ duyệt". The tone sets the
 * colour and the default icon; `icon` replaces the icon, and `null` leaves it out where the words say enough.
 */
export function AdminBadge({
  tone,
  icon,
  children,
}: {
  tone: BadgeTone;
  icon?: LucideIcon | null;
  children: ReactNode;
}) {
  const Icon = icon === undefined ? toneIcons[tone] : icon;
  return (
    <Badge variant={tone}>
      {Icon && <Icon aria-hidden />}
      {children}
    </Badge>
  );
}

export type SellerStatus = "active" | "pending" | "blocked";

const statuses: Record<SellerStatus, { tone: BadgeTone; icon: LucideIcon }> = {
  active: { tone: "success", icon: CircleCheckIcon },
  pending: { tone: "warning", icon: ClockIcon },
  blocked: { tone: "error", icon: BanIcon },
};

/** A store's status (Figma Admin/StatusBadge 228:5238): "Đang hoạt động", "Chờ duyệt", "Bị chặn". */
export function StatusBadge({ status }: { status: SellerStatus }) {
  const t = useTranslations("admin.shell.status");
  const { tone, icon } = statuses[status];
  return (
    <AdminBadge tone={tone} icon={icon}>
      {t(status)}
    </AdminBadge>
  );
}
