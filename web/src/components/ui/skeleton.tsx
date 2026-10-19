import { cn } from "@/lib/utils";

// Second Bite: the shapes of what loads, a round picture and a card (DESIGN.md › Shapes).
const skeletonShapes = {
  default: "rounded-md",
  circle: "rounded-full",
  card: "rounded-2xl",
} as const;

function Skeleton({
  className,
  shape = "default",
  ...props
}: React.ComponentProps<"div"> & { shape?: keyof typeof skeletonShapes }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse bg-secondary", skeletonShapes[shape], className)}
      {...props}
    />
  );
}

export { Skeleton };
