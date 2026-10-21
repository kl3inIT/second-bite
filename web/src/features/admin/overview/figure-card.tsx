import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

/**
 * A figure of the reports (Figma AD-BC1 › KPI) on the shared Card: its name, then the number in Bricolage with its
 * unit beside it ("42 đơn"). A figure the backend cannot give yet (`value` null) shows "—" and the words for no
 * data in the unit's place, never a zero that reads as a measurement. The overview composes its own Cards.
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
    <Card className="min-w-0">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
