"use client";

import { useId } from "react";

export type Segment<Value extends string> = { value: Value; label: string };

/**
 * A choice of two to four (Figma Admin/SegmentedControl 243:60136): SMTP | Brevo, Hôm nay | 7 ngày | 30 ngày.
 * The chosen one is white on the sky wash. Native radio buttons underneath, so the arrows move between them and
 * a screen reader names the group with `label`.
 */
export function SegmentedControl<Value extends string>({
  label,
  value,
  segments,
  onChange,
  disabled,
}: {
  label: string;
  value: Value;
  segments: Segment<Value>[];
  onChange: (value: Value) => void;
  disabled?: boolean;
}) {
  const name = useId();

  return (
    <fieldset
      disabled={disabled}
      className="inline-flex h-11 w-fit items-center gap-1 rounded-md border border-border bg-muted p-1 disabled:opacity-50"
    >
      <legend className="sr-only">{label}</legend>
      {segments.map((segment) => (
        <label
          key={segment.value}
          className="flex h-9 cursor-pointer items-center rounded-sm border border-transparent px-4 text-body-sm-strong text-muted-foreground transition-colors hover:text-foreground has-checked:border-border has-checked:bg-card has-checked:text-foreground has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
        >
          <input
            type="radio"
            name={name}
            value={segment.value}
            checked={segment.value === value}
            onChange={() => onChange(segment.value)}
            className="sr-only"
          />
          {segment.label}
        </label>
      ))}
    </fieldset>
  );
}
