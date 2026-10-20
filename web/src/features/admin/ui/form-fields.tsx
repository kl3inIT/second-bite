"use client";

import { ChevronDownIcon, CircleXIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

// The fields of the marketing forms (Figma Admin/FormField, Admin/Input, Admin/Switch in AD-MK2, MK4, MK6): a label
// over its control and no helper line under it; only a problem the form cannot hold back shows there, in red.

/** A field's name over its control, 12px strong (Figma Admin/FormField › label). */
export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-label-strong text-foreground">
      {children}
    </label>
  );
}

/** A group's name over a choice or a picker, 14px strong ("Loại giảm", "Kênh đổi mã"). */
export function GroupLabel({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="text-body-sm-strong text-foreground">
      {children}
    </p>
  );
}

/** What is still wrong with a field, under it in red with its icon. */
export function FieldProblem({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-center gap-1.5 text-label text-destructive">
      <CircleXIcon aria-hidden className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}

/** A segmented choice that scrolls sideways on a phone instead of running past the edge. */
export function ChoiceRow({ children }: { children: ReactNode }) {
  return <div className="max-w-full overflow-x-auto">{children}</div>;
}

/** A line of text, a day or a time in the admin's 44px field, its label above and its problem below. */
export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  maxLength,
  min,
  max,
  placeholder,
  problem,
  disabled,
  end,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: "text" | "url" | "date" | "time" | "datetime-local";
  maxLength?: number;
  min?: string;
  max?: string;
  placeholder?: string;
  problem?: string;
  disabled?: boolean;
  /** Something at the end of the row, outside the field, such as "Tạo lại". */
  end?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <InputGroup surface="admin">
            <InputGroupInput
              id={id}
              type={type}
              value={value}
              maxLength={maxLength}
              min={min}
              max={max}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete="off"
              aria-invalid={problem ? true : undefined}
              aria-describedby={problem ? `${id}-problem` : undefined}
              onChange={(event) => onChange(event.target.value)}
              onBlur={onBlur}
            />
          </InputGroup>
        </div>
        {end}
      </div>
      {problem && <FieldProblem id={`${id}-problem`}>{problem}</FieldProblem>}
    </div>
  );
}

/** A switch with its words beside it, the whole row 44px and pressable (Figma Admin/Switch). */
export function SwitchField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-body-sm text-foreground">
      <Switch checked={checked} onCheckedChange={(next) => onChange(next)} />
      {label}
    </label>
  );
}

export type PickOption = { id: string; name: string };

/**
 * A choice of several things in the admin's select (Figma Admin/Select › "Cửa hàng: 5 cửa hàng đã chọn"): a list
 * of checkboxes opens under it. `empty` says there is nothing to choose.
 */
export function ManyPicker({
  label,
  value,
  options,
  chosen,
  onChange,
  empty,
  labelledBy,
}: {
  label: string;
  value: string;
  options: PickOption[];
  chosen: string[];
  onChange: (chosen: string[]) => void;
  empty: string;
  labelledBy?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger variant="field" aria-describedby={labelledBy} className="w-full">
        <span className="text-muted-foreground">{label}:</span>
        <span className="min-w-0 flex-1 truncate text-left text-body-sm-strong text-foreground">
          {value}
        </span>
        <ChevronDownIcon aria-hidden className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start">
        {options.length === 0 ? (
          <p className="px-1 py-2 text-body-sm text-muted-foreground">{empty}</p>
        ) : (
          <ul className="flex max-h-72 flex-col overflow-y-auto">
            {options.map((option) => (
              <li key={option.id}>
                <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-sm px-2 hover:bg-muted">
                  <Checkbox
                    checked={chosen.includes(option.id)}
                    onCheckedChange={(checked) =>
                      onChange(
                        checked
                          ? [...chosen, option.id]
                          : chosen.filter((each) => each !== option.id),
                      )
                    }
                  />
                  <span className="truncate text-body-sm text-foreground">{option.name}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
