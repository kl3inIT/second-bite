import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// The lime pill on a photograph (DESIGN.md › Components › Sticker): how many are left, always as text.
const stickerVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-label-strong whitespace-nowrap",
  {
    variants: {
      tone: {
        fresh: "bg-fresh text-fresh-foreground",
        soldOut: "bg-muted-foreground text-card",
      },
    },
    defaultVariants: { tone: "fresh" },
  },
);

export type StickerTone = NonNullable<VariantProps<typeof stickerVariants>["tone"]>;

export function Sticker({
  tone,
  className,
  children,
}: {
  tone?: StickerTone;
  className?: string;
  children: React.ReactNode;
}) {
  return <span className={cn(stickerVariants({ tone }), className)}>{children}</span>;
}
