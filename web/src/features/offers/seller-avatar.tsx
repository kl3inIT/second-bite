import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { avatarTone, initials } from "./seller";

// A seller's photo in a white-ringed circle (Figma "store logo"), or their initials while it loads and when the
// seller has none, on shadcn's Avatar. It repeats the name beside it, so it is hidden from assistive
// technology. Figma draws two letters at 6px on the small one; one letter at 12px is the smallest that reads.
export function SellerAvatar({
  seller,
  size,
  className,
}: {
  seller: { id: string; name: string; photo?: { smallPath: string } };
  size: "md" | "sm";
  className?: string;
}) {
  return (
    <Avatar aria-hidden size={size === "md" ? "seller" : "seller-xs"} className={className}>
      {seller.photo && <AvatarImage src={`/api${seller.photo.smallPath}`} alt="" />}
      <AvatarFallback tone={avatarTone(seller.id)}>
        {size === "sm" ? Array.from(initials(seller.name))[0] : initials(seller.name)}
      </AvatarFallback>
    </Avatar>
  );
}
