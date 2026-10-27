import * as React from "react";
import { cn } from "@/lib/utils";

// Second Bite: `sky` is the pale filled field without a border, as the search fields are (Figma K6b).
function Textarea({
  className,
  surface = "default",
  ...props
}: React.ComponentProps<"textarea"> & { surface?: "default" | "sky" }) {
  return (
    <textarea
      data-slot="textarea"
      data-surface={surface}
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-card px-3.5 py-2 text-body transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        "data-[surface=sky]:border-transparent data-[surface=sky]:bg-muted data-[surface=sky]:text-body md:data-[surface=sky]:text-body-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
