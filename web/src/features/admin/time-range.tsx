"use client";

import { ClockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/** The parts of the day one tap chooses. */
const presets = [
  ["morning", "06:00", "11:00"],
  ["noon", "11:00", "14:00"],
  ["afternoon", "14:00", "17:00"],
  ["evening", "17:00", "22:00"],
] as const;

/**
 * A part of the day in an admin's filter bar, beside the days: "Khung giờ: 17:30 – 21:15" on a field, and under
 * it the parts one tap chooses, or any time from and to in hours and minutes. "Cả ngày" clears it. A range ending
 * at 00:00 ends at midnight (24:00), so the evening's last minutes can be kept.
 */
export function TimeRange({
  from,
  until,
  onChange,
}: {
  from: string | null;
  until: string | null;
  onChange: (from: string | null, until: string | null) => void;
}) {
  const t = useTranslations("Admin.timeRange");
  const id = useId();
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(from ?? "17:00");
  const [end, setEnd] = useState(until === "24:00" ? "00:00" : (until ?? "21:00"));
  const endAt = end === "00:00" ? "24:00" : end;
  const valid = /^\d{2}:\d{2}$/.test(start) && /^\d{2}:\d{2}$/.test(end) && start < endAt;
  const shown = (value: string) => (value === "24:00" ? "24:00" : value);

  const choose = (next: [string, string] | null) => {
    onChange(next?.[0] ?? null, next?.[1] ?? null);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setStart(from ?? "17:00");
          setEnd(until === "24:00" ? "00:00" : (until ?? "21:00"));
        }
      }}
    >
      <PopoverTrigger render={<Button variant="field" />}>
        <ClockIcon data-icon="inline-start" />
        <span className="text-muted-foreground">{t("label")}:</span>
        <span className="text-body-sm-strong">
          {from && until ? `${shown(from)} – ${shown(until)}` : t("anytime")}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <div className="flex flex-col gap-4 p-1">
          <fieldset aria-label={t("presets")} className="grid grid-cols-2 gap-2">
            {presets.map(([key, a, b]) => (
              <Button
                key={key}
                variant="choice"
                aria-pressed={from === a && until === b}
                onClick={() => choose([a, b])}
              >
                {t(`preset.${key}`, { from: a, until: b })}
              </Button>
            ))}
          </fieldset>
          <div className="flex flex-col gap-3 border-t border-border pt-3">
            <p className="text-body-sm-strong text-foreground">{t("custom")}</p>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor={`${id}-from`}>{t("from")}</FieldLabel>
                <Input
                  id={`${id}-from`}
                  type="time"
                  step={60}
                  value={start}
                  aria-invalid={!valid}
                  onChange={(event) => setStart(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-until`}>{t("until")}</FieldLabel>
                <Input
                  id={`${id}-until`}
                  type="time"
                  step={60}
                  value={end}
                  aria-invalid={!valid}
                  aria-describedby={`${id}-hint`}
                  onChange={(event) => setEnd(event.target.value)}
                />
              </Field>
            </div>
            <p
              id={`${id}-hint`}
              className={valid ? "text-label text-muted-foreground" : "text-label text-destructive"}
            >
              {valid ? t("midnight") : t("invalid")}
            </p>
            <Button disabled={!valid} onClick={() => choose([start, endAt])}>
              {t("apply")}
            </Button>
          </div>
          {from && (
            <Button variant="ghost" onClick={() => choose(null)}>
              {t("anytime")}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
