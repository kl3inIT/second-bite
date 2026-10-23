"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

import { NumberInput } from "./number-input";
import { clockOf, lengthIsAllowed, minutesUntil, nextStart, startSuggestions } from "./post-draft";
import { vietnamDay } from "./store-day";

const LENGTHS = [60, 90, 120, 180];
type Clock = { hour: number; minute: number };

/** Clock choices fill one row each. A new start always gets a fresh one-hour end. */
export function WindowChoices({
  now,
  start,
  minutes,
  onStart,
  onMinutes,
}: {
  now: Date;
  start: Date;
  minutes: number;
  onStart: (at: Date) => void;
  onMinutes: (minutes: number) => void;
}) {
  const t = useTranslations("PostDrawer");
  const format = useFormatter();
  const choices = startSuggestions(now);
  const customStart = !choices.some((at) => at.getTime() === start.getTime());
  const end = new Date(start.getTime() + minutes * 60_000);
  const time = (at: Date) => format.dateTime(at, "time");
  const differentDay =
    vietnamDay.format(start) !== vietnamDay.format(now) ||
    vietnamDay.format(end) !== vietnamDay.format(start);
  return (
    <section aria-labelledby="post-pickup" className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 id="post-pickup" className="text-title-lg">
          {t("pickupTitle")}
        </h3>
        <Badge
          variant="pickup"
          render={<output aria-live="polite" />}
          aria-label={t("pickupTitle")}
        >
          {t("timeRange", { from: time(start), until: time(end) })}
        </Badge>
      </div>
      {differentDay && (
        <p className="text-note text-muted-foreground">
          {t("pickupDates", {
            from: format.dateTime(start, "dayMonth"),
            until: format.dateTime(end, "dayMonth"),
          })}
        </p>
      )}
      <fieldset className="flex min-w-0 flex-col gap-2">
        <legend className="mb-2 text-title">{t("startLabel")}</legend>
        <div className="grid grid-cols-4 gap-2">
          {choices.map((at) => (
            <Button
              key={at.toISOString()}
              type="button"
              variant="choice"
              size="choice"
              aria-pressed={at.getTime() === start.getTime()}
              onClick={() => onStart(at)}
            >
              {time(at)}
            </Button>
          ))}
          <TimeChoice
            title={t("customStart")}
            selected={customStart}
            label={customStart ? time(start) : t("other")}
            value={clockOf(start)}
            onApply={(value) => onStart(nextStart(value.hour, value.minute, now))}
          />
        </div>
      </fieldset>
      <fieldset className="flex min-w-0 flex-col gap-2">
        <legend className="mb-2 text-title">{t("endLabel")}</legend>
        <div className="grid grid-cols-5 gap-2">
          {LENGTHS.map((length) => (
            <Button
              key={length}
              type="button"
              variant="choice"
              size="choice"
              aria-pressed={minutes === length}
              onClick={() => onMinutes(length)}
            >
              {time(new Date(start.getTime() + length * 60_000))}
            </Button>
          ))}
          <TimeChoice
            title={t("customEnd")}
            selected={!LENGTHS.includes(minutes)}
            label={!LENGTHS.includes(minutes) ? time(end) : t("other")}
            value={clockOf(end)}
            check={(value) => lengthIsAllowed(minutesUntil(start, value.hour, value.minute))}
            onApply={(value) => onMinutes(minutesUntil(start, value.hour, value.minute))}
          />
        </div>
      </fieldset>
      <p className="text-note text-muted-foreground">{t("endHint")}</p>
    </section>
  );
}

function TimeChoice({
  title,
  selected,
  label,
  value,
  check,
  onApply,
}: {
  title: string;
  selected: boolean;
  label: string;
  value: Clock;
  check?: (value: Clock) => boolean;
  onApply: (value: Clock) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={`${title}: ${label}`}
        aria-pressed={selected}
        render={<Button type="button" variant="choice" size="choice" />}
      >
        {label}
        {!selected && <ChevronDown className="size-3" aria-hidden />}
      </PopoverTrigger>
      <PopoverContent align="end" side="top" variant="editor">
        {open && (
          <TimeEditor
            value={value}
            title={title}
            check={check}
            onCancel={() => setOpen(false)}
            onApply={(next) => {
              onApply(next);
              setOpen(false);
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

function TimeEditor({
  title,
  value,
  check,
  onCancel,
  onApply,
}: {
  title: string;
  value: Clock;
  check?: (value: Clock) => boolean;
  onCancel: () => void;
  onApply: (value: Clock) => void;
}) {
  const t = useTranslations("PostDrawer");
  const [hour, setHour] = useState(String(value.hour).padStart(2, "0"));
  const [minute, setMinute] = useState(String(value.minute).padStart(2, "0"));
  const [attempted, setAttempted] = useState(false);
  const next = { hour: Number(hour), minute: Number(minute) };
  const clockValid = hour !== "" && minute !== "" && next.hour < 24 && next.minute < 60;
  const valid = clockValid && (!check || check(next));
  return (
    <>
      <PopoverTitle>{title}</PopoverTitle>
      <div className="grid grid-cols-2 gap-3">
        <TimeColumn
          label={t("hour")}
          value={hour}
          onChange={setHour}
          limit={24}
          invalid={attempted && !valid}
        />
        <TimeColumn
          label={t("minute")}
          value={minute}
          onChange={setMinute}
          limit={60}
          invalid={attempted && !valid}
        />
      </div>
      <PopoverDescription>{t("timeHint")}</PopoverDescription>
      {attempted && !valid && (
        <FieldError>{clockValid ? t("endInvalid") : t("clockInvalid")}</FieldError>
      )}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button
          type="button"
          onClick={() => {
            setAttempted(true);
            if (valid) onApply(next);
          }}
        >
          {t("apply")}
        </Button>
      </div>
    </>
  );
}

/** Adjacent minutes/hours are real 44px step buttons; numeric input and keyboard arrows work too. */
function TimeColumn({
  label,
  value,
  onChange,
  limit,
  invalid,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  limit: number;
  invalid: boolean;
}) {
  const t = useTranslations("PostDrawer");
  const id = useId();
  const column = useRef<HTMLDivElement>(null);
  const adjacent = (by: number) => (Number(value) + by + limit) % limit;
  const step = (by: number) => onChange(String(adjacent(by)).padStart(2, "0"));
  useEffect(() => {
    const element = column.current;
    if (!element) return;
    function wheel(event: WheelEvent) {
      if (event.deltaY === 0) return;
      event.preventDefault();
      const by = event.deltaY > 0 ? 1 : -1;
      onChange(String((Number(value) + by + limit) % limit).padStart(2, "0"));
    }
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [value, onChange, limit]);
  return (
    <div ref={column} className="flex min-w-0 flex-col items-center gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        aria-label={t("previousTime", {
          part: label,
          value: String(adjacent(-1)).padStart(2, "0"),
        })}
        onClick={() => step(-1)}
      >
        <ChevronUp className="size-3" aria-hidden />
        {String(adjacent(-1)).padStart(2, "0")}
      </Button>
      <NumberInput
        id={id}
        max={2}
        value={value}
        onValueChange={onChange}
        aria-invalid={invalid || undefined}
        className="text-center"
        onKeyDown={(event) => {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            step(event.key === "ArrowUp" ? 1 : -1);
          }
        }}
      />
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        aria-label={t("nextTime", { part: label, value: String(adjacent(1)).padStart(2, "0") })}
        onClick={() => step(1)}
      >
        <ChevronDown className="size-3" aria-hidden />
        {String(adjacent(1)).padStart(2, "0")}
      </Button>
    </div>
  );
}
