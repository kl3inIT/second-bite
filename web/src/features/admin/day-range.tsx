"use client";

import { CalendarIcon } from "lucide-react";
import { useFormatter, useLocale } from "next-intl";
import { useState } from "react";
import { enUS, vi } from "react-day-picker/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * A range of days in an admin's filter bar (Figma Admin/DateRange): "label: from – to" on a field, a calendar
 * of two months under it, and `anytime` to clear it. Days are whole days, today the last that can be chosen.
 */
export function DayRange({
  label,
  anytime,
  from,
  to,
  onChange,
}: {
  label: string;
  anytime: string;
  from: Date | null;
  to: Date | null;
  onChange: (from: Date | null, to: Date | null) => void;
}) {
  const format = useFormatter();
  const locale = useLocale();
  const [today] = useState(() => new Date());
  const day = (d: Date) => format.dateTime(d, "calendarDay");

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="field" />}>
        <CalendarIcon data-icon="inline-start" />
        <span className="text-muted-foreground">{label}:</span>
        <span className="text-body-sm-strong">
          {from ? `${day(from)} – ${day(to ?? from)}` : anytime}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Calendar
          mode="range"
          locale={locale === "vi" ? vi : enUS}
          timeZone="UTC"
          selected={from ? { from, to: to ?? from } : undefined}
          onSelect={(range) => onChange(range?.from ?? null, range?.to ?? range?.from ?? null)}
          disabled={{ after: today }}
        />
        {from && (
          <div className="border-t border-border p-2">
            <Button variant="ghost" className="w-full" onClick={() => onChange(null, null)}>
              {anytime}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
