"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { ClockField } from "./clock-field";
import {
  defaultShifts,
  maxShiftName,
  maxShifts,
  problemsOf,
  type Shift,
  type ShiftProblem,
} from "./shifts";

/**
 * "Cài đặt ca" (SEC-209): the shifts a day is cut into, each a name and the hours it runs from and to, from one
 * to six, in order and without overlap. The form tells what is wrong before it applies; the server holds the
 * same rules. A shift ending at 24:00 ends at midnight.
 */
export function ShiftSettingsDialog({
  shifts,
  onApply,
  children,
}: {
  shifts: Shift[];
  onApply: (shifts: Shift[]) => void;
  /** The button that opens it. */
  children: ReactNode;
}) {
  const t = useTranslations("Admin.shiftReports.settings");
  const id = useId();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Shift[]>(shifts);
  const [tried, setTried] = useState(false);
  const problems = problemsOf(rows);

  const change = (row: number, patch: Partial<Shift>) =>
    setRows((all) => all.map((s, i) => (i === row ? { ...s, ...patch } : s)));
  const problemOf = (row: number, field: ShiftProblem["field"]) =>
    tried ? problems.find((p) => p.row === row && p.field === field) : undefined;

  const messageOf = (problem: ShiftProblem | undefined) =>
    problem && problem.reason !== "count" ? t(`problem.${problem.reason}`) : undefined;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setRows(shifts);
          setTried(false);
        }
      }}
    >
      <DialogTrigger render={<Button variant="secondary" size="default" />}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setTried(true);
            if (problems.length > 0) return;
            onApply(rows.map((s) => ({ ...s, name: s.name.trim() })));
            setOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          <ul className="flex flex-col gap-3">
            {rows.map((shift, row) => (
              <li key={row} className="flex items-start gap-2">
                <Cell
                  className="min-w-0 flex-1"
                  id={`${id}-name-${row}`}
                  label={t("name")}
                  message={messageOf(problemOf(row, "name"))}
                >
                  <Input
                    id={`${id}-name-${row}`}
                    value={shift.name}
                    maxLength={maxShiftName}
                    aria-invalid={problemOf(row, "name") ? true : undefined}
                    onChange={(event) => change(row, { name: event.target.value })}
                  />
                </Cell>
                <Cell
                  className="w-32"
                  id={`${id}-from-${row}`}
                  label={t("from")}
                  message={messageOf(problemOf(row, "from"))}
                >
                  <ClockField
                    id={`${id}-from-${row}`}
                    label={t("from")}
                    value={shift.from}
                    invalid={problemOf(row, "from") !== undefined}
                    onChange={(from) => change(row, { from })}
                  />
                </Cell>
                <Cell
                  className="w-32"
                  id={`${id}-until-${row}`}
                  label={t("until")}
                  message={messageOf(problemOf(row, "until"))}
                >
                  <ClockField
                    id={`${id}-until-${row}`}
                    label={t("until")}
                    value={shift.until}
                    end
                    invalid={problemOf(row, "until") !== undefined}
                    onChange={(until) => change(row, { until })}
                  />
                </Cell>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-6"
                  aria-label={t("remove", { number: row + 1 })}
                  disabled={rows.length <= 1}
                  onClick={() => setRows((all) => all.filter((_, i) => i !== row))}
                >
                  <Trash2Icon aria-hidden />
                </Button>
              </li>
            ))}
          </ul>

          {tried && problems.some((p) => p.reason === "count") && (
            <p role="alert" className="text-body-sm text-destructive">
              {t("problem.count", { max: maxShifts })}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={rows.length >= maxShifts}
              onClick={() => {
                const last = rows.at(-1);
                const from = last && last.until !== "24:00" ? last.until : "00:00";
                setRows((all) => [
                  ...all,
                  { name: t("newName", { number: all.length + 1 }), from, until: "24:00" },
                ]);
              }}
            >
              <PlusIcon data-icon="inline-start" />
              {t("add")}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setRows(defaultShifts)}>
              {t("reset")}
            </Button>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              {t("cancel")}
            </DialogClose>
            <Button type="submit">{t("apply")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** A field of a row: its label above it, and what is wrong below. */
function Cell({
  className,
  id,
  label,
  message,
  children,
}: {
  className: string;
  id: string;
  label: string;
  message: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="text-label text-muted-foreground">
        {label}
      </label>
      {children}
      {message && (
        <p role="alert" className="text-label text-destructive">
          {message}
        </p>
      )}
    </div>
  );
}
