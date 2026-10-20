"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { EmptyState } from "./empty-state";

export type ChartPoint = { label: string; value: number };

/**
 * A series in a white card (Figma Admin/ChartCard 243:65351, AD-TQ1, AD-BC1): its title and, at the right, the
 * span it covers ("14 ngày qua"); the total in Bricolage with its unit ("1.120 phần · hôm nay 121"); then the
 * line or the bars, one per day or week, the value of each under the pointer. With no points it shows the
 * empty state, never zeros that look measured (docs: SEC-62 design › The dashboard read API).
 */
export function ChartCard({
  title,
  span,
  figure,
  unit,
  kind = "line",
  points,
  seriesLabel,
  action,
}: {
  title: string;
  span?: string;
  figure?: ReactNode;
  unit?: string;
  kind?: "line" | "bar";
  points: ChartPoint[];
  /** What a value is, in the tooltip: "Đơn", "Phần ăn". */
  seriesLabel: string;
  /** A link at the top right instead of the span, such as "Xem báo cáo ›". */
  action?: ReactNode;
}) {
  const t = useTranslations("admin.shell");
  const config = {
    value: { label: seriesLabel, color: "var(--color-primary)" },
  } satisfies ChartConfig;

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-body-sm-strong text-foreground">{title}</h2>
        {action ?? (span && <span className="text-label text-muted-foreground">{span}</span>)}
      </div>
      {figure !== undefined && points.length > 0 && (
        <p className="flex items-baseline gap-2">
          <span className="font-display text-display text-foreground">{figure}</span>
          {unit && <span className="text-body-sm text-muted-foreground">{unit}</span>}
        </p>
      )}
      {points.length === 0 ? (
        <EmptyState title={t("empty")} />
      ) : (
        <ChartContainer config={config} className="aspect-auto h-50 w-full">
          {kind === "line" ? (
            <LineChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
              <Line
                dataKey="value"
                type="linear"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          ) : (
            <BarChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ChartContainer>
      )}
    </section>
  );
}
