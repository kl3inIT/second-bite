import { cn } from "cn";

// A row that scrolls sideways to the screen's edge, 16px in from it, snapping to each item (Figma carousel,
// categories). It takes keyboard focus so a row without links can still be scrolled (WCAG 2.1.1).
export function ScrollRow({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ul
      aria-label={label}
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be reachable by keyboard.
      tabIndex={0}
      className={cn(
        "flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </ul>
  );
}
