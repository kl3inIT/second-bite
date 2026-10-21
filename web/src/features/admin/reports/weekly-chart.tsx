"use client";

import { ChartColumnIcon } from "lucide-react";
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axisTicks } from "@/features/admin/overview/daily-series";
import { dayToDate } from "@/features/admin/overview/days";
import { formatDayMonth } from "@/i18n/day-month";

import type { Week } from "./report-query";

type WeekBar = Week & { key: string; days: string; value: string };

/**
 * Posts by week (Figma AD-BC1 › Card · theo tuần): one bar a week on a hairline grid with its y axis; under each
 * bar its count and its days, the week still under way drawn lighter and named so in words. Under the pointer a
 * bar shows its week in the chart's tooltip; the weeks are in a table for the screen reader. Orders take this place
 * once SEC-15 records them. `weeks` is empty when the report cannot give it (one store chosen).
 */
export function WeeklyChart({ weeks }: { weeks: Week[] }) {
  const t = useTranslations("admin.reports.chart");
  const empty = useTranslations("admin.shell");
  const locale = useLocale();
  const config = {
    count: { label: t("postsColumn"), color: "var(--color-primary)" },
  } satisfies ChartConfig;
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
    <section aria-labelledby="reports-chart" className="min-w-0">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 id="reports-chart">{t("title")}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bars.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ChartColumnIcon aria-hidden />
                </EmptyMedia>
                <EmptyTitle>{empty("empty")}</EmptyTitle>
              </EmptyHeader>
            </Empty>
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
                    content={
                      <ChartTooltipContent
                        labelFormatter={(_, payload) =>
                          (payload?.[0]?.payload as WeekBar | undefined)?.days
                        }
                      />
                    }
                  />
                  <Bar
                    dataKey="count"
                    maxBarSize={64}
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                  >
                    {bars.map((bar) => (
                      <Cell
                        key={bar.key}
                        fill={bar.running ? "var(--color-secondary-hover)" : "var(--color-count)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
              <Table className="sr-only">
                <TableCaption>{t("title")}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">{t("week")}</TableHead>
                    <TableHead scope="col">{t("postsColumn")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bars.map((bar) => (
                    <TableRow key={bar.key}>
                      <TableHead scope="row">{bar.days}</TableHead>
                      <TableCell>{bar.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
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
