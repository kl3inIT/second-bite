"use client";

import { CircleXIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

/**
 * A field of words with its label over it (Figma Admin/FormField + Admin/Input, AD-CS4): "Địa chỉ gửi", "Host".
 * No helper line under it; `error` is what is wrong with it: the backend's refusal of this field, when it names it,
 * or a check made in the page once the field is left.
 */
export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  ...input
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
} & Pick<
  ComponentProps<"input">,
  | "type"
  | "placeholder"
  | "disabled"
  | "autoComplete"
  | "inputMode"
  | "maxLength"
  | "readOnly"
  | "onBlur"
>) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-label-strong text-foreground">
        {label}
      </label>
      <InputGroup surface="admin">
        <InputGroupInput
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...input}
        />
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
