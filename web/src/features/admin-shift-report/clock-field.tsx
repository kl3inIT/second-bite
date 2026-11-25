"use client";

import { ClockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { WheelPicker } from "@/components/ui/wheel-picker";

const two = (n: number) => String(n).padStart(2, "0");

/** A time as its two wheels' values; the midnight that ends a shift, 24:00, is the wheels' 00:00. */
function wheelsOf(value: string): { hour: number; minute: number } {
  const [hour = "0", minute = "0"] = value === "24:00" ? ["0", "0"] : value.split(":");
  return { hour: Number(hour) % 24, minute: Number(minute) % 60 };
}

/**
 * A time of day chosen on two wheels, hours and minutes, as on a phone (SEC-209): it cannot be written wrong.
 * `end` marks the end of a shift, whose 00:00 is the midnight that closes the day and reads 24:00.
 */
export function ClockField({
  id,
  label,
  value,
  end = false,
  invalid = false,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  end?: boolean;
  invalid?: boolean;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("Admin.shiftReports.settings.clock");
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          const wheels = wheelsOf(value);
          setHour(wheels.hour);
          setMinute(wheels.minute);
        }
      }}
    >
      <PopoverTrigger
        render={
          <Button id={id} type="button" variant="field" aria-invalid={invalid || undefined} />
        }
      >
        <ClockIcon data-icon="inline-start" aria-hidden />
        <span className="text-body-sm-strong">{value}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <PopoverTitle>{label}</PopoverTitle>
        <div className="grid grid-cols-2 gap-3">
          <WheelPicker label={t("hour")} count={24} value={hour} onValueChange={setHour} />
          <WheelPicker label={t("minute")} count={60} value={minute} onValueChange={setMinute} />
        </div>
        <Button
          type="button"
          className="mt-2 w-full"
          onClick={() => {
            onChange(end && hour === 0 && minute === 0 ? "24:00" : `${two(hour)}:${two(minute)}`);
            setOpen(false);
          }}
        >
          {t("done")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
