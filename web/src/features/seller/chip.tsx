import { cn } from "@/lib/utils";

// A choice drawn as a pill (Figma P2, P3: the kind of a dish, the hour, the length): the chosen one is blue, the
// others white with an edge. The target is 44 px high though the pill is 36, as everywhere else on the web.
export function Chip({
  selected,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { selected: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "group/chip flex min-h-11 items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "flex h-9 items-center rounded-full border px-3.5 text-label-strong whitespace-nowrap transition-colors",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-foreground group-hover/chip:bg-secondary",
        )}
      >
        {children}
      </span>
    </button>
  );
}
