import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

// Second Bite: hidden from assistive technology; the control it sits in says, from the catalogs, that it is working.
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      data-slot="spinner"
      aria-hidden
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
