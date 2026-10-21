"use client";

import { useTranslations } from "next-intl";

import { NativeSelect } from "@/components/ui/native-select";

import { Chip } from "./chip";
import { clock, MAX_WINDOW_MINUTES, MIN_WINDOW_MINUTES } from "./post-draft";

/** The hours offered besides the usual one and "now" (Figma P3). */
const FIXED_STARTS = [
  { hour: 20, minute: 0 },
  { hour: 21, minute: 0 },
  { hour: 21, minute: 30 },
  { hour: 22, minute: 0 },
] as const;
export const LENGTHS = [60, 30, 90, 120] as const;

export type StartKey = "usual" | "now" | `${number}:${number}` | "custom";
export type Clock = { hour: number; minute: number };

/**
 * When a post is collected (Figma P3): the hour it starts, as the usual one, now, a fixed hour or one picked,
 * and how long it lasts, as a usual length or one picked. Choices of the drawer, not fields it checks: the
 * window they make is checked when the post is sent.
 */
export function WindowChoices({
  usual,
  startKey,
  onStartKey,
  customStart,
  onCustomStart,
  length,
  onLength,
  customLength,
  onCustomLength,
}: {
  usual: Clock;
  startKey: StartKey;
  onStartKey: (key: StartKey) => void;
  customStart: Clock;
  onCustomStart: (start: Clock) => void;
  length: number | "custom";
  onLength: (length: number | "custom") => void;
  customLength: number;
  onCustomLength: (minutes: number) => void;
}) {
  const t = useTranslations("PostDrawer");

  return (
    <>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-title">{t("startQuestion")}</legend>
        <div className="-my-1 flex flex-wrap gap-x-2">
          <Chip size="lg" selected={startKey === "usual"} onClick={() => onStartKey("usual")}>
            {t("usual", { time: clock(usual.hour, usual.minute) })}
          </Chip>
          <Chip size="lg" selected={startKey === "now"} onClick={() => onStartKey("now")}>
            {t("now")}
          </Chip>
          {FIXED_STARTS.filter(
            (fixed) => fixed.hour !== usual.hour || fixed.minute !== usual.minute,
          ).map((fixed) => {
            const key = `${fixed.hour}:${fixed.minute}` as const;
            return (
              <Chip size="lg" key={key} selected={startKey === key} onClick={() => onStartKey(key)}>
                {clock(fixed.hour, fixed.minute)}
              </Chip>
            );
          })}
          <Chip size="lg" selected={startKey === "custom"} onClick={() => onStartKey("custom")}>
            {t("otherTime")}
          </Chip>
        </div>
        {startKey === "custom" && (
          <div className="flex items-center gap-2">
            <NativeSelect
              aria-label={t("hour")}
              value={customStart.hour}
              onChange={(event) =>
                onCustomStart({ ...customStart, hour: Number(event.target.value) })
              }
            >
              {Array.from({ length: 24 }, (_, hour) => (
                <option key={hour} value={hour}>
                  {String(hour).padStart(2, "0")}
                </option>
              ))}
            </NativeSelect>
            <span aria-hidden>:</span>
            <NativeSelect
              aria-label={t("minute")}
              value={customStart.minute}
              onChange={(event) =>
                onCustomStart({ ...customStart, minute: Number(event.target.value) })
              }
            >
              {[0, 15, 30, 45].map((minute) => (
                <option key={minute} value={minute}>
                  {String(minute).padStart(2, "0")}
                </option>
              ))}
            </NativeSelect>
          </div>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-title">{t("lengthQuestion")}</legend>
        <div className="-my-1 flex flex-wrap gap-x-2">
          {LENGTHS.map((value) => (
            <Chip size="lg" key={value} selected={length === value} onClick={() => onLength(value)}>
              {t(`length.${value}`)}
            </Chip>
          ))}
          <Chip size="lg" selected={length === "custom"} onClick={() => onLength("custom")}>
            {t("otherLength")}
          </Chip>
        </div>
        {length === "custom" && (
          <NativeSelect
            aria-label={t("lengthQuestion")}
            value={customLength}
            onChange={(event) => onCustomLength(Number(event.target.value))}
          >
            {Array.from(
              { length: (MAX_WINDOW_MINUTES - MIN_WINDOW_MINUTES) / 30 + 1 },
              (_, index) => MIN_WINDOW_MINUTES + index * 30,
            ).map((value) => (
              <option key={value} value={value}>
                {t("minutes", { minutes: value })}
              </option>
            ))}
          </NativeSelect>
        )}
      </fieldset>
    </>
  );
}
