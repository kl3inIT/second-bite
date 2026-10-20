"use client";

import { ChevronRightIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { adminHref } from "@/features/admin/pages";
import { formatDayMonth } from "@/i18n/day-month";
import { EmptyState } from "@/features/admin/ui/empty-state";
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
    <section
      aria-labelledby="overview-chart"
      className="flex min-w-0 flex-1 flex-col gap-4 rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="overview-chart" className="text-title-lg text-foreground">
          {t("title")}
        </h2>
        <Link
          href={adminHref("reports")}
          className="-mr-1 inline-flex min-h-11 items-center gap-1 rounded-sm pr-1 pl-2 text-body-sm-strong text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {t("report")}
          <ChevronRightIcon aria-hidden className="size-4" />
        </Link>
      </div>
      {data.length === 0 ? (
        <EmptyState title={empty("empty")} />
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
                content={({ active, payload }) => (
                  <DayTooltip
                    active={active}
                    point={payload?.[0]?.payload as DailyPoint | undefined}
                  />
                )}
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
    </section>
  );
}

// Figma AD-TQ2 › Tooltip: the day, then the posts with the line's key, then the new accounts.
function DayTooltip({ active, point }: { active?: boolean; point?: DailyPoint }) {
  const t = useTranslations("admin.overview.chart");
  const format = useFormatter();
  if (!active || !point) return null;
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-card px-3.5 py-3 shadow-lg">
      <p className="text-label-strong text-muted-foreground">
        {format.dateTime(dayToDate(point.date), "weekdayDay")}
      </p>
      <p className="flex items-center gap-2 text-body-sm-strong text-foreground">
        <span aria-hidden className="h-0.75 w-3.5 rounded-full bg-primary" />
        {t("posts", { count: point.posts })}
      </p>
      <p className="text-body-sm text-foreground">{t("accounts", { count: point.accounts })}</p>
    </div>
  );
}
