import { cn } from "@/lib/utils";

// Second Bite: the shapes of what loads, a round picture and a card (DESIGN.md › Shapes); `frame` fills a frame that
// already has its own shape, such as a map loading inside its rounded box (SEC-66).
const skeletonShapes = {
  default: "rounded-md",
  circle: "rounded-full",
  card: "rounded-2xl",
  frame: "size-full",
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
