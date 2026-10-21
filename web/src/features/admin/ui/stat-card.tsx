import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import type { BadgeTone } from "./badge";

const tones: Record<BadgeTone, { tile: string; ink: string }> = {
  success: { tile: "bg-fresh-muted", ink: "text-success" },
  warning: { tile: "bg-warning", ink: "text-warning-foreground" },
  error: { tile: "bg-destructive/10", ink: "text-destructive" },
  info: { tile: "bg-secondary", ink: "text-primary" },
  neutral: { tile: "bg-muted", ink: "text-muted-foreground" },
};

/**
 * A figure with its name (Figma Admin/StatCard 228:5659): the tone's icon on its tile, "Đang hoạt động", "34" in
 * Bricolage, and room on the right for a small chart (`chart`, a `Sparkline`), which may stay empty until the
 * backend gives the series. With `href` it is a filter: pressing it opens that filter, and `selected` draws its
 * blue edge (Style 6.1, the cards replace the tabs).
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  chart,
  href,
  selected = false,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  tone: BadgeTone;
  chart?: ReactNode;
  href?: string;
  selected?: boolean;
}) {
  const body = (
    <>
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-md",
          tones[tone].tile,
          tones[tone].ink,
        )}
      >
        <Icon aria-hidden className="size-5.5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-body-sm-strong text-muted-foreground">{label}</span>
        <span className="font-display text-display text-foreground">{value}</span>
      </span>
      {chart && <span className={cn("h-9 w-27 shrink-0", tones[tone].ink)}>{chart}</span>}
    </>
  );
  const frame = cn(
    "flex items-center gap-3.5 rounded-xl border bg-card px-4.5 py-4 text-left",
    selected ? "border-2 border-primary px-4 py-3.75" : "border-border",
  );

  if (!href) return <div className={frame}>{body}</div>;
  return (
    <Link
      href={href}
      aria-current={selected ? "true" : undefined}
      className={cn(
        frame,
        "transition-colors hover:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
      )}
    >
      {body}
    </Link>
  );
}

/**
 * A small trend in the StatCard's colour (Figma "Sparkline · 14 ngày"): one point a day, the last marked. Each
 * point carries its day and value for the screen reader and the pointer (`labels`). Nothing is drawn without
 * at least two points.
 */
export function Sparkline({ points, labels }: { points: number[]; labels?: string[] }) {
  if (points.length < 2) return null;
  const width = 108;
  const height = 36;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const x = (index: number) => 3 + (index * (width - 6)) / (points.length - 1);
  const y = (value: number) => 4 + ((max - value) * (height - 8)) / span;
  const line = points.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  const last = points.length - 1;

  return (
    <>
      {labels && (
        <span className="sr-only">
          {labels.map((label, i) => `${label}: ${points[i]}`).join(", ")}
        </span>
      )}
      {/* Each day's value shows under the pointer through its band's title. */}
      <svg aria-hidden viewBox={`0 0 ${width} ${height}`} className="size-full overflow-visible">
        <polygon
          points={`${x(0)},${height} ${line} ${x(last)},${height}`}
          className="fill-current opacity-12"
        />
        <polyline
          points={line}
          className="fill-none stroke-current"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx={x(last)} cy={y(points[last])} r={3} className="fill-current stroke-card" />
        {labels?.map((label, index) => (
          <rect
            key={label}
            x={x(index) - (width - 6) / (points.length - 1) / 2}
            y={0}
            width={(width - 6) / (points.length - 1)}
            height={height}
            className="fill-transparent"
          >
            <title>{`${label}: ${points[index]}`}</title>
          </rect>
        ))}
      </svg>
    </>
  );
}
