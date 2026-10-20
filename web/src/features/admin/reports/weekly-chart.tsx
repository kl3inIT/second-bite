"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  type XAxisTickContentProps,
  YAxis,
} from "recharts";

import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { axisTicks } from "@/features/admin/overview/daily-series";
import { dayToDate } from "@/features/admin/overview/days";
import { EmptyState } from "@/features/admin/ui/empty-state";
import { formatDayMonth } from "@/i18n/day-month";

import type { Week } from "./report-query";

const config = {
  count: { label: "posts", color: "var(--color-primary)" },
} satisfies ChartConfig;

type WeekBar = Week & { key: string; days: string; value: string };

/**
 * Posts by week (Figma AD-BC1 › Card · theo tuần): one bar a week on a hairline grid with its y axis; under each
 * bar its count and its days, the week still under way drawn lighter and named so in words. Under the pointer a
 * bar shows its week in a tooltip; the weeks are in a table for the screen reader. Orders take this place once
 * SEC-15 records them. `weeks` is empty when the report cannot give it (one store chosen).
 */
export function WeeklyChart({ weeks }: { weeks: Week[] }) {
  const t = useTranslations("admin.reports.chart");
  const empty = useTranslations("admin.shell");
  const locale = useLocale();
  const bars: WeekBar[] = weeks.map((week) => {
    const span = {
      from: formatDayMonth(dayToDate(week.from), locale),
      to: formatDayMonth(dayToDate(week.to), locale),
    };
    return {
      ...week,
      key: week.from,
      days: week.running ? t("running", span) : t("days", span),
      value: t("posts", { count: week.count }),
    };
  });
  const ticks = axisTicks(Math.max(0, ...weeks.map((week) => week.count)));

  return (
    <section
      aria-labelledby="reports-chart"
      className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-card p-6"
    >
      <h2 id="reports-chart" className="text-title-lg text-foreground">
        {t("title")}
      </h2>
      {bars.length === 0 ? (
        <EmptyState title={empty("empty")} />
      ) : (
        <>
          <ChartContainer config={config} className="aspect-auto h-72 w-full">
            <BarChart data={bars} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="key"
                axisLine={{ stroke: "var(--color-input)" }}
                tickLine={false}
                height={52}
                interval="preserveStartEnd"
                tick={(props: XAxisTickContentProps) => (
                  <WeekTick
                    x={Number(props.x)}
                    y={Number(props.y)}
                    bar={bars.find((bar) => bar.key === props.payload.value)}
                    // The last week's words end at the plot's edge, so a long one is not cut on a phone.
                    toEdge={
                      props.payload.value === bars.at(-1)?.key
                        ? Number(props.width) / bars.length / 2
                        : undefined
                    }
                  />
                )}
              />
              <YAxis
                width={36}
                tickLine={false}
                axisLine={false}
                ticks={ticks}
                interval={0}
                domain={[0, ticks[ticks.length - 1] ?? 4]}
              />
              <ChartTooltip
                content={({ active, payload }) => (
                  <WeekTooltip active={active} bar={payload?.[0]?.payload as WeekBar | undefined} />
                )}
              />
              <Bar dataKey="count" maxBarSize={64} radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {bars.map((bar) => (
                  <Cell
                    key={bar.key}
                    fill={bar.running ? "var(--color-secondary-hover)" : "var(--color-count)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
          <table className="sr-only">
            <caption>{t("title")}</caption>
            <thead>
              <tr>
                <th scope="col">{t("week")}</th>
                <th scope="col">{t("postsColumn")}</th>
              </tr>
            </thead>
            <tbody>
              {bars.map((bar) => (
                <tr key={bar.key}>
                  <th scope="row">{bar.days}</th>
                  <td>{bar.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}

// Figma AD-BC1 › X axis › tick: the week's count, strong, over its days, muted.
function WeekTick({ x, y, bar, toEdge }: { x: number; y: number; bar?: WeekBar; toEdge?: number }) {
  if (!bar) return null;
  // About 6.5px a character at 12px: half the words wider than the room to the edge would be cut.
  const cut = toEdge !== undefined && !Number.isNaN(toEdge) && bar.days.length * 3.25 > toEdge;
  const anchor = cut ? "end" : "middle";
  const dx = cut ? toEdge : 0;
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" dy={16} className="fill-foreground text-body-sm-strong">
        {bar.value}
      </text>
      <text textAnchor={anchor} dx={dx} dy={36} className="fill-muted-foreground text-label">
        {bar.days}
      </text>
    </g>
  );
}

function WeekTooltip({ active, bar }: { active?: boolean; bar?: WeekBar }) {
  const t = useTranslations("admin.reports.chart");
  if (!active || !bar) return null;
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-card px-3.5 py-3 shadow-lg">
      <p className="text-label-strong text-muted-foreground">{bar.days}</p>
      <p className="flex items-center gap-2 text-body-sm-strong text-foreground">
        <span
          aria-hidden
          className={bar.running ? "size-2.5 bg-secondary-hover" : "size-2.5 bg-primary"}
        />
        {t("postsLong", { count: bar.count })}
      </p>
    </div>
  );
}
