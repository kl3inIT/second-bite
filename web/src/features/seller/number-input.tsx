"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

const grouping = new Intl.NumberFormat("vi-VN");

/** What the text holds of digits, at most `max` of them. */
function digitsOf(text: string, max: number): string {
  return text.replace(/\D/g, "").slice(0, max);
}

// A field for a whole number (units, a price in đồng), whose value is the digits, as a string. A price is
// written with its dots ("95.000") only while the field is not being typed in: reformatting on every key moves
// the caret, and a Vietnamese keyboard (Telex, VNI) builds a letter from several keys, which a field that
// rewrites its text underneath breaks. While a letter is being composed the text is left as typed and is
// read once the composition ends.
export function NumberInput({
  value,
  onValueChange,
  grouped = false,
  max = 9,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "type"> & {
  value: string;
  onValueChange: (digits: string) => void;
  /** Shows the number with its dots when the field is not focused. */
  grouped?: boolean;
  /** At most this many digits. */
  max?: number;
}) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState<string>();

  const shown = draft ?? (grouped && !focused && value ? grouping.format(Number(value)) : value);

  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={shown}
      onFocus={(event) => {
        setFocused(true);
        props.onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        setDraft(undefined);
        props.onBlur?.(event);
      }}
      onChange={(event) => {
        if ((event.nativeEvent as InputEvent).isComposing) {
          setDraft(event.target.value);
          return;
        }
        setDraft(undefined);
        onValueChange(digitsOf(event.target.value, max));
      }}
      onCompositionEnd={(event) => {
        setDraft(undefined);
        onValueChange(digitsOf(event.currentTarget.value, max));
      }}
    />
  );
}
