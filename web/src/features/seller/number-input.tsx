"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";

const grouping = new Intl.NumberFormat("vi-VN");

/** What the text holds of digits, at most `max` of them. */
function digitsOf(text: string, max: number): string {
  return text.replace(/\D/g, "").slice(0, max);
}

/** How many digits the text holds before `position`. */
function digitsBefore(text: string, position: number): number {
  return text.slice(0, position).replace(/\D/g, "").length;
}

/** The position in `text` just after its `count`-th digit. */
function positionAfter(text: string, count: number): number {
  let seen = 0;
  let position = 0;
  while (position < text.length && seen < count) {
    if (/\d/.test(text.charAt(position))) seen += 1;
    position += 1;
  }
  return position;
}

// A field for a whole number (units, a price in đồng), whose value is the digits, as a string. It asks for a digit
// keypad as a phone number does (`type="tel"` with `inputMode="numeric"`), not the letters' keyboard. A price is
// shown with its dots ("95.000") all the time, so the text never changes under the person's hands when the field
// is focused; the caret stays after the same digit when a dot is added or removed. A Vietnamese keyboard (Telex,
// VNI) builds a letter from several keys, which a field that rewrites its text underneath breaks, so while a
// letter is being composed the text is left as typed and is read once the composition ends.
export function NumberInput({
  value,
  onValueChange,
  grouped = false,
  max = 9,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "type" | "ref"> & {
  value: string;
  onValueChange: (digits: string) => void;
  /** Writes the number with its dots. */
  grouped?: boolean;
  /** At most this many digits. */
  max?: number;
}) {
  const field = useRef<HTMLInputElement>(null);
  /** How many digits sit before the caret after the last edit, to put the caret back after them. */
  const caret = useRef<number>(undefined);
  const [draft, setDraft] = useState<string>();

  const shown = draft ?? (grouped && value ? grouping.format(Number(value)) : value);

  useLayoutEffect(() => {
    const element = field.current;
    const digits = caret.current;
    caret.current = undefined;
    if (!element || digits === undefined || document.activeElement !== element) return;
    const position = positionAfter(element.value, digits);
    element.setSelectionRange(position, position);
  });

  return (
    <Input
      {...props}
      ref={field}
      type="tel"
      inputMode="numeric"
      autoComplete="off"
      value={shown}
      onBlur={(event) => {
        setDraft(undefined);
        props.onBlur?.(event);
      }}
      onChange={(event) => {
        if ((event.nativeEvent as InputEvent).isComposing) {
          setDraft(event.target.value);
          return;
        }
        setDraft(undefined);
        caret.current = digitsBefore(event.target.value, event.target.selectionStart ?? 0);
        onValueChange(digitsOf(event.target.value, max));
      }}
      onCompositionEnd={(event) => {
        setDraft(undefined);
        caret.current = digitsBefore(
          event.currentTarget.value,
          event.currentTarget.selectionStart ?? 0,
        );
        onValueChange(digitsOf(event.currentTarget.value, max));
      }}
    />
  );
}
