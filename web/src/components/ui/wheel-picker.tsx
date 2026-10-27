"use client";

// oxlint-disable jsx-a11y/prefer-tag-over-role -- A native number input cannot contain the scrolling rows of this wheel.

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// Five 44px rows, with two rows of padding above and below the values. Native scrolling retains iOS inertia.
const ROW_HEIGHT = 44;

/** A cyclic numeric wheel. Its scroll position is the draft value; the owning editor applies or cancels it. */
export function WheelPicker({
  label,
  count,
  value,
  onValueChange,
  invalid = false,
}: {
  label: string;
  count: number;
  value: number;
  onValueChange: (value: number) => void;
  invalid?: boolean;
}) {
  const labelId = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const lastValue = useRef<number>(undefined);
  const settling = useRef<ReturnType<typeof setTimeout>>(undefined);
  const touch = useRef(false);
  const drag = useRef<{ y: number; top: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const two = (next: number) => String(next).padStart(2, "0");

  useEffect(() => {
    if (viewport.current && lastValue.current !== value) {
      lastValue.current = value;
      viewport.current.scrollTop = (count + value) * ROW_HEIGHT;
    }
  }, [count, value]);
  useEffect(() => () => clearTimeout(settling.current), []);

  function notify(next: number) {
    if (lastValue.current === next) return;
    lastValue.current = next;
    onValueChange(next);
  }

  function settle() {
    clearTimeout(settling.current);
    settling.current = setTimeout(() => {
      const element = viewport.current;
      if (!element || touch.current || drag.current) return;
      const next = Math.max(0, Math.round(element.scrollTop / ROW_HEIGHT)) % count;
      notify(next);
      // Recenter only once scrolling stops, keeping a full cycle on either side for the next gesture.
      element.scrollTop = (count + next) * ROW_HEIGHT;
    }, 180);
  }

  function finishDrag() {
    const element = viewport.current;
    if (!drag.current || !element) return;
    drag.current = null;
    setDragging(false);
    element.scrollTo({
      top: Math.round(element.scrollTop / ROW_HEIGHT) * ROW_HEIGHT,
      behavior: "smooth",
    });
    settle();
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span id={labelId} className="text-center text-title">
        {label}
      </span>
      <div className="relative overflow-hidden rounded-xl">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-22 h-11 rounded-lg border-y border-input bg-secondary"
        />
        <div
          ref={viewport}
          role="spinbutton"
          tabIndex={0}
          aria-labelledby={labelId}
          aria-valuemin={0}
          aria-valuemax={count - 1}
          aria-valuenow={value}
          aria-valuetext={two(value)}
          aria-invalid={invalid || undefined}
          data-dragging={dragging || undefined}
          className="relative h-55 cursor-grab touch-pan-y snap-y snap-mandatory [scrollbar-width:none] overflow-y-auto overscroll-y-contain rounded-xl outline-none select-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset data-dragging:cursor-grabbing data-dragging:snap-none [&::-webkit-scrollbar]:hidden"
          onScroll={(event) => {
            notify(Math.max(0, Math.round(event.currentTarget.scrollTop / ROW_HEIGHT)) % count);
            settle();
          }}
          onTouchStart={() => {
            touch.current = true;
            clearTimeout(settling.current);
          }}
          onTouchEnd={() => {
            touch.current = false;
            settle();
          }}
          onTouchCancel={() => {
            touch.current = false;
            settle();
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            event.preventDefault();
            event.currentTarget.focus();
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { y: event.clientY, top: event.currentTarget.scrollTop };
            setDragging(true);
          }}
          onPointerMove={(event) => {
            if (drag.current)
              event.currentTarget.scrollTop = drag.current.top + drag.current.y - event.clientY;
          }}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onLostPointerCapture={finishDrag}
          onKeyDown={(event) => {
            let next: number;
            switch (event.key) {
              case "ArrowUp":
                next = (value + 1) % count;
                break;
              case "ArrowDown":
                next = (value - 1 + count) % count;
                break;
              case "Home":
                next = 0;
                break;
              case "End":
                next = count - 1;
                break;
              default:
                return;
            }
            event.preventDefault();
            clearTimeout(settling.current);
            notify(next);
            event.currentTarget.scrollTop = (count + next) * ROW_HEIGHT;
          }}
        >
          <div aria-hidden className="py-22">
            {Array.from({ length: count * 3 }, (_, index) => (
              <div
                key={index}
                className={cn(
                  "flex h-11 snap-center items-center justify-center",
                  index % count === value
                    ? "text-price-lg text-primary"
                    : "text-title-lg text-muted-foreground",
                )}
              >
                {two(index % count)}
              </div>
            ))}
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-22 bg-linear-to-b from-popover to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-22 bg-linear-to-t from-popover to-transparent"
        />
      </div>
    </div>
  );
}
