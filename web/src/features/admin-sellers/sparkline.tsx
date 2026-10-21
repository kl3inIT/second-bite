"use client";

import { Area, AreaChart, YAxis } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { StatusDayBody } from "@/lib/api/generated";

import type { cardStatuses } from "./search-params";

// Each card's line in its status's colour (Figma AD-Q1 › Sparkline · 14 ngày), as its icon has it.
const colour = {
  active: "var(--success)",
  pending: "var(--warning-foreground)",
  blocked: "var(--destructive)",
} as const;

/**
 * How many stores stood in a status on each of the last 14 days (Figma AD-Q1 › Sparkline · 14 ngày): a line
 * over a pale area, the last day marked. The server counts the days from when it began counting, so the line
 * starts there; with fewer than two days there is no line to draw. The figure beside it says the same, so the
 * line is hidden from assistive technology.
 */
export function Sparkline({
  status,
  days,
}: {
  status: (typeof cardStatuses)[number];
  days: StatusDayBody[];
}) {
  if (days.length < 2) return null;

  const config = { [status]: { color: colour[status] } } satisfies ChartConfig;
  const last = days.length - 1;

  return (
    <ChartContainer config={config} aria-hidden className="aspect-auto h-9 w-27 shrink-0">
      {/* No keyboard layer: the line is a picture of the figure beside it, not something to explore. */}
      <AreaChart
        data={days}
        margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
        accessibilityLayer={false}
      >
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Area
          dataKey={status}
          type="linear"
          stroke={`var(--color-${status})`}
          strokeWidth={2}
          fill={`var(--color-${status})`}
          fillOpacity={0.12}
          isAnimationActive={false}
          dot={(props: { cx?: number; cy?: number; index?: number }) =>
            props.index === last ? (
              <circle
                key="last"
                cx={props.cx}
                cy={props.cy}
                r={3}
                fill={`var(--color-${status})`}
              />
            ) : (
              <g key={props.index} />
            )
          }
        />
      </AreaChart>
    </ChartContainer>
  );
}
