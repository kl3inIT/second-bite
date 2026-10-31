import {
  CircleCheckIcon,
  ClockIcon,
  FlagIcon,
  PauseCircleIcon,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

import type { PromotionStatus } from "./search-params";

/** Each status's tone and icon, on its badge and its card: never colour alone. */
export const statusLook: Record<
  PromotionStatus,
  { variant: "success" | "warning" | "neutral"; tone: string; icon: LucideIcon }
> = {
  running: { variant: "success", tone: "bg-fresh-muted text-success", icon: CircleCheckIcon },
  scheduled: { variant: "warning", tone: "bg-warning text-warning-foreground", icon: ClockIcon },
  paused: { variant: "neutral", tone: "bg-muted text-muted-foreground", icon: PauseCircleIcon },
  ended: { variant: "neutral", tone: "bg-muted text-muted-foreground", icon: FlagIcon },
};

export function PromotionStatusBadge({ status }: { status: PromotionStatus }) {
  const t = useTranslations("Admin.promotions.status");
  const { variant, icon: Icon } = statusLook[status];

  return (
    <Badge variant={variant}>
      <Icon data-icon="inline-start" aria-hidden />
      {t(status)}
    </Badge>
  );
}
