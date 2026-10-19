import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { avatarTone, initials } from "./seller";

// A seller's initials in a white-ringed circle (Figma "store logo"). It repeats the name beside it, so
// it is hidden from assistive technology.
const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full border-2 border-card font-display font-bold text-avatar-foreground",
  {
    variants: {
      size: {
        md: "size-9 text-body-13",
        // Figma draws two letters at 6px here; one letter at 11px is the smallest that can still be read.
        sm: "size-4.5 border text-micro-11 leading-none",
      },
      tone: {
        clay: "bg-avatar-clay",
        rose: "bg-avatar-rose",
        indigo: "bg-avatar-indigo",
        olive: "bg-avatar-olive",
      },
    },
  },
);

export function SellerAvatar({
  seller,
  size,
  className,
}: {
  seller: { id: string; name: string };
  size: "md" | "sm";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(avatarVariants({ size, tone: avatarTone(seller.id) }), className)}
    >
      {size === "sm" ? Array.from(initials(seller.name))[0] : initials(seller.name)}
    </span>
  );
}
