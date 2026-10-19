import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { avatarTone, initials } from "./seller";

// A seller's initials in a white-ringed circle (Figma "store logo"), on shadcn's Avatar so a seller's photo
// can take their place when the API has one. It repeats the name beside it, so it is hidden from assistive
// technology. Figma draws two letters at 6px on the small one; one letter at 12px is the smallest that reads.
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
    <Avatar aria-hidden size={size === "md" ? "seller" : "seller-xs"} className={className}>
      <AvatarFallback tone={avatarTone(seller.id)}>
        {size === "sm" ? Array.from(initials(seller.name))[0] : initials(seller.name)}
      </AvatarFallback>
    </Avatar>
  );
}
