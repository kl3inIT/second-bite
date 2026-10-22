import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { photoUrl } from "@/lib/api/photo";

import { avatarTone, initials } from "./seller";

// A seller's photo in a white-ringed circle (Figma "store logo"), or their initials while it loads and when the
// seller has none, on shadcn's Avatar. The photo comes as an address (`photo`, which a seller of the shop carries) or
// as the identifier a store's own pages carry (`photoId`), so the list of stores, the menu and the header draw it alike. It repeats the name beside it, so it is hidden from assistive
// technology. Figma draws two letters at 6px on the small one; one letter at 12px is the smallest that reads.
export function SellerAvatar({
  seller,
  size,
  className,
}: {
  seller: { id: string; name: string; photo?: { smallPath: string }; photoId?: string };
  size: "md" | "sm";
  className?: string;
}) {
  const smallPath =
    seller.photo?.smallPath ?? (seller.photoId ? `/photos/${seller.photoId}/400.jpg` : undefined);

  return (
    <Avatar aria-hidden size={size === "md" ? "seller" : "seller-xs"} className={className}>
      {smallPath && <AvatarImage src={photoUrl(smallPath)} alt="" />}
      <AvatarFallback tone={avatarTone(seller.id)}>
        {size === "sm" ? Array.from(initials(seller.name))[0] : initials(seller.name)}
      </AvatarFallback>
    </Avatar>
  );
}
