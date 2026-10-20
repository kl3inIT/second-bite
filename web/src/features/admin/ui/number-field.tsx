"use client";

import { CircleXIcon } from "lucide-react";
import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

import { clamp } from "./numbers";

/**
 * A number with its unit (Figma Admin/FormField + Admin/Input, AD-CS1): "Giảm tối thiểu", "20 %". It never takes
 * a value outside `min`..`max` (docs: admin-web-flow › Cài đặt bài đăng): a number over `max` becomes `max` as it
 * is typed, one under `min` becomes `min` when the field is left, so there is no range error at the field. Bounds
 * that hang on another field ("ngắn nhất" up to "dài nhất") are passed already worked out. `error` is the
 * backend's word for this field, when it still refuses it.
 */
export function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  unit,
  disabled,
  error,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
  disabled?: boolean;
  error?: string;
}) {
  // What is in the field while it is being typed, which may be empty or under `min` for a moment.
  const [draft, setDraft] = useState<string>();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label-strong text-foreground">
        {label}
      </label>
      <InputGroup surface="admin">
        <InputGroupInput
          id={id}
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          value={draft ?? String(value)}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "").slice(0, 9);
            if (digits === "") {
              setDraft("");
              return;
            }
            const typed = Number(digits);
            if (typed > max) {
              setDraft(undefined);
              onChange(max);
            } else {
              setDraft(typed < min ? digits : undefined);
              onChange(Math.max(typed, min));
            }
          }}
          onBlur={() => {
            if (draft !== undefined) onChange(clamp(Number(draft || min), min, max));
            setDraft(undefined);
          }}
        />
        {unit && (
          <InputGroupAddon align="inline-end">
            <InputGroupText>{unit}</InputGroupText>
          </InputGroupAddon>
        )}
      </InputGroup>
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-label text-destructive">
          <CircleXIcon aria-hidden className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
