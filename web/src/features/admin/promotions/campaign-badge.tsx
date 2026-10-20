import { ClockIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { AdminBadge, type BadgeTone } from "../ui/badge";
import type { CampaignStatus } from "./promotion";
import { vietnamDay } from "./schedule";

const tones: Record<CampaignStatus, BadgeTone> = {
  running: "success",
  scheduled: "info",
  paused: "neutral",
  ended: "neutral",
};

/**
 * A code's, a banner's or a sponsored place's status (Figma Admin/Badge in AD-MK1, MK3, MK7): "Đang chạy" in
 * green with its tick, "Lên lịch" in blue with a clock, "Tạm dừng" and "Hết hạn" in grey with a clock.
 */
export function CampaignBadge({ status }: { status: CampaignStatus }) {
  const t = useTranslations("admin.promotions.status");
  return (
    <AdminBadge tone={tones[status]} icon={status === "running" ? undefined : ClockIcon}>
      {t(status)}
    </AdminBadge>
  );
}

/**
 * A run from its first to its last day, "01/10 – 31/10/2026", the year once when both days share it (Figma
 * AD-MK1 › Hiệu lực, AD-MK7 › Thời gian).
 */
export function PeriodText({ start, end }: { start: string; end: string }) {
  const format = useFormatter();
  const from = new Date(start);
  const to = new Date(end);
  const sameYear = vietnamDay(from).slice(0, 4) === vietnamDay(to).slice(0, 4);
  return (
    <span className="text-body-sm whitespace-nowrap text-foreground">
      <time dateTime={from.toISOString()}>
        {format.dateTime(from, sameYear ? "dayMonth" : "day")}
      </time>
      {" – "}
      <time dateTime={to.toISOString()}>{format.dateTime(to, "day")}</time>
    </span>
  );
}

/** A count or a share that the list measures, in Bricolage and blue (Figma AD-MK1 › Giảm, AD-MK5 › Đã gửi). */
export function FigureText({ children }: { children: string }) {
  return <span className="font-display text-price whitespace-nowrap text-primary">{children}</span>;
}
