"use client";

import { ChevronRightIcon, InboxIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { adminHref } from "@/features/admin/pages";
import { formatDayMonth } from "@/i18n/day-month";
import { Link } from "@/i18n/navigation";

import { axisTicks, type DailyPoint } from "./daily-series";
import { dayToDate } from "./days";

const config = {
  posts: { label: "posts", color: "var(--color-primary)" },
} satisfies ChartConfig;

/**
 * The posts of each day (Figma AD-TQ1 › Card · Biểu đồ, AD-TQ2): one 2px line on a hairline grid with its y axis,
 * the last day marked. Under the pointer, or with the arrows once the chart has focus, a dashed crosshair finds
 * the day and the tooltip names it with its posts and new accounts. The same days are in a table for the screen
 * reader. Orders take this place once SEC-15 records them.
 */
export function DailyChart({ points }: { points: DailyPoint[] }) {
  const t = useTranslations("admin.overview.chart");
  const empty = useTranslations("admin.shell");
  const format = useFormatter();
  const locale = useLocale();
  const data = points.map((point) => ({
    ...point,
    label: formatDayMonth(dayToDate(point.date), locale),
  }));
  const last = data.length - 1;
  const ticks = axisTicks(Math.max(0, ...points.map((point) => point.posts)));

  return (
    <section aria-labelledby="overview-chart" className="flex min-w-0 flex-1 flex-col">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            <h2 id="overview-chart">{t("title")}</h2>
          </CardTitle>
          <CardAction>
            <Link href={adminHref("reports")} className={buttonVariants({ variant: "link" })}>
              {t("report")}
              <ChevronRightIcon aria-hidden data-icon="inline-end" />
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <InboxIcon aria-hidden />
                </EmptyMedia>
                <EmptyTitle>{empty("empty")}</EmptyTitle>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <ChartContainer config={config} className="aspect-auto h-60 w-full">
                <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    minTickGap={28}
                  />
                  <YAxis
                    width={32}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    ticks={ticks}
                    interval={0}
                    domain={[0, ticks[ticks.length - 1] ?? 4]}
                  />
                  <ChartTooltip
                    cursor={{ stroke: "var(--color-muted-foreground)", strokeDasharray: "4 4" }}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        labelFormatter={(_, payload) => {
                          const point = payload?.[0]?.payload as DailyPoint | undefined;
                          return point
                            ? format.dateTime(dayToDate(point.date), "weekdayDay")
                            : null;
                        }}
                        formatter={(_, __, item) => {
                          const point = item.payload as DailyPoint;
                          return (
                            <span className="flex flex-col gap-1">
                              <span>{t("posts", { count: point.posts })}</span>
                              <span>{t("accounts", { count: point.accounts })}</span>
                            </span>
                          );
                        }}
                      />
                    }
                  />
                  <Line
                    dataKey="posts"
                    type="linear"
                    stroke="var(--color-posts)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    isAnimationActive={false}
                    dot={({ index, cx, cy }) =>
                      index === last ? (
                        <circle
                          key="last"
                          cx={cx}
                          cy={cy}
                          r={5}
                          strokeWidth={2}
                          className="fill-primary stroke-card"
                        />
                      ) : (
                        <g key={index} />
                      )
                    }
                    activeDot={{ r: 6, strokeWidth: 2, className: "fill-primary stroke-card" }}
                  />
                </LineChart>
              </ChartContainer>
              <table className="sr-only">
                <caption>{t("table")}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t("day")}</th>
                    <th scope="col">{t("postsColumn")}</th>
                    <th scope="col">{t("accountsColumn")}</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <tr key={point.date}>
                      <th scope="row">{format.dateTime(dayToDate(point.date), "day")}</th>
                      <td>{point.posts}</td>
                      <td>{point.accounts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
