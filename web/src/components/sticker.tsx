import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

// The amber pill on a photograph (DESIGN.md › Components › Sticker): stock or the collection window, always as text.
const stickerVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-caption-12 font-bold whitespace-nowrap",
  {
    variants: {
      tone: {
        highlight: "bg-highlight text-highlight-foreground",
        soldOut: "bg-muted-foreground text-card",
      },
    },
    defaultVariants: { tone: "highlight" },
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
