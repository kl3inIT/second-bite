import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const STARS = [1, 2, 3, 4, 5] as const;

/** One to five stars filled out of five, read as `label` (a sentence such as "4 trên 5 sao") by a screen reader. */
export function ReviewStars({
  stars,
  label,
  className,
}: {
  stars: number;
  label: string;
  className?: string;
}) {
  return (
    <span className="flex gap-0.5">
      <span className="sr-only">{label}</span>
      {STARS.map((n) => (
        <StarIcon
          key={n}
          aria-hidden
          className={cn("size-5 text-rating", n <= stars && "fill-current", className)}
        />
      ))}
    </span>
  );
}
