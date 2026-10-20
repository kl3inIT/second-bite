import { cn } from "@/lib/utils";

// A choice drawn as a pill (Figma P2, P3: the kind of a dish, the hour, the length): the chosen one is blue, the
// others white with an edge. The target is 44 px high though the pill may be 38, as everywhere else on the web.
export function Chip({
  selected,
  size = "md",
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { selected: boolean; size?: "md" | "lg" }) {
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
          "flex items-center rounded-full border whitespace-nowrap transition-colors",
          // 38 px high with 16 px sides, or 44 px with 18 px, as Figma draws the two (Q2, P2b and P3).
          size === "lg" ? "h-11 px-4.5" : "h-9.5 px-4",
          selected
            ? "border-primary bg-primary text-body-sm-strong text-primary-foreground"
            : "border-border bg-card text-body-sm text-foreground group-hover/chip:bg-secondary",
        )}
      >
        {children}
      </span>
    </button>
  );
}
