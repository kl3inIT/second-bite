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

import { cn } from "@/lib/utils";

import type { OrderStatus } from "./order";

// Each status with its icon and its tone, so it is never told by colour alone (web guideline › Components):
// Figma W2 confirmed, W3 ready, W4 cancelled, W5 refused, W6 expired.
const looks: Record<OrderStatus, { icon: LucideIcon; tone: string }> = {
  confirmed: { icon: ClockIcon, tone: "bg-secondary text-secondary-foreground" },
  ready: { icon: PackageCheckIcon, tone: "bg-fresh text-fresh-foreground" },
  collected: { icon: CircleCheckIcon, tone: "bg-success text-success-foreground" },
  cancelled: { icon: CircleXIcon, tone: "bg-muted text-foreground" },
  refused: { icon: BanIcon, tone: "bg-destructive text-destructive-foreground" },
  expired: { icon: TimerOffIcon, tone: "bg-warning text-warning-foreground" },
};

/** The status as a small labelled chip, for a list of orders. */
export function OrderStatusChip({ status }: { status: OrderStatus }) {
  const t = useTranslations("Orders.status");
  const { icon: Icon, tone } = looks[status];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-label-strong",
        tone,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {t(status)}
    </span>
  );
}
