import type { ReactNode } from "react";

/**
 * A figure of the dashboard or the reports (Figma AD-TQ1 › KPI, AD-BC1 › KPI): its name, then the number in
 * Bricolage with its unit beside it ("42 đơn", "32 / 34 cửa hàng"); no line under it. A figure the backend cannot
 * give yet (`value` null) shows "—" and the words for no data in the unit's place, never a zero that reads as a
 * measurement.
 */
export function FigureCard({
  label,
  value,
  unit,
  noData,
}: {
  label: string;
  value: ReactNode | null;
  unit?: ReactNode;
  noData: string;
}) {
  const missing = value === null;
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <p className="text-body-sm text-muted-foreground">{label}</p>
      <p className="flex flex-wrap items-baseline gap-x-1.5">
        <span className="font-display text-display text-foreground">{missing ? "—" : value}</span>
        <span
          className={
            missing ? "text-body-sm text-muted-foreground" : "text-body-sm-strong text-foreground"
          }
        >
          {missing ? noData : unit}
        </span>
      </p>
    </div>
  );
}
