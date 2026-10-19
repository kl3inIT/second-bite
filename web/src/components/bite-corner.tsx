import { cn } from "@/lib/utils";

// The bitten top right corner of a card or banner (Figma "góc bị cắn", DESIGN.md › The Bite Rule): three
// bites cut in the colour of the ground behind the card. The parent clips it and sets its size.
export function BiteCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      aria-hidden
      className={cn("pointer-events-none absolute top-0 right-0 fill-background", className)}
    >
      <circle cx="51.8" cy="4.2" r="17.36" />
      <circle cx="29.4" cy="-1.4" r="11.76" />
      <circle cx="57.4" cy="26.6" r="11.76" />
    </svg>
  );
}
