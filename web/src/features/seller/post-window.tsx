"use client";

import { ChevronDown } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { WheelPicker } from "@/components/ui/wheel-picker";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

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
        <div className="grid grid-cols-5 gap-2">
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
  const [hour, setHour] = useState(value.hour);
  const [minute, setMinute] = useState(value.minute);
  const [attempted, setAttempted] = useState(false);
  const next = { hour, minute };
  const valid = !check || check(next);
  return (
    <>
      <PopoverTitle>{title}</PopoverTitle>
      <div className="grid grid-cols-2 gap-3">
        <WheelPicker
          label={t("hour")}
          value={hour}
          onValueChange={setHour}
          count={24}
          invalid={attempted && !valid}
        />
        <WheelPicker
          label={t("minute")}
          value={minute}
          onValueChange={setMinute}
          count={60}
          invalid={attempted && !valid}
        />
      </div>
      <PopoverDescription>{t("timeHint")}</PopoverDescription>
      {attempted && !valid && <FieldError>{t("endInvalid")}</FieldError>}
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
