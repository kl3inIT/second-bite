import Image from "next/image";

import { cn } from "@/lib/utils";

import type { OfferSummary } from "./offer";
import { avatarTone, initials } from "./seller";

const tones = {
  clay: "bg-avatar-clay",
  rose: "bg-avatar-rose",
  indigo: "bg-avatar-indigo",
  olive: "bg-avatar-olive",
} as const;

// A seller's logo in a square with rounded corners and a hairline (Figma K4 "logo", K4b "store logo"): their
// photograph once they have one, their initials on their colour until then (DESIGN.md › Seller avatars). It
// repeats the name beside it, so it is hidden from assistive technology.
export function SellerLogo({
  seller,
  size,
}: {
  seller: Pick<OfferSummary["seller"], "id" | "name" | "photo">;
  size: "sm" | "md" | "lg";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border border-border text-avatar-foreground",
        {
          sm: "size-10 rounded-md text-label-strong",
          md: "size-11 rounded-md text-label-strong",
          lg: "size-14 rounded-lg text-title",
        }[size],
        !seller.photo && tones[avatarTone(seller.id)],
      )}
    >
      {seller.photo ? (
        <Image
          src={`/api${seller.photo.smallPath}`}
          alt=""
          fill
          sizes="56px"
          unoptimized
          className="bg-card object-cover"
        />
      ) : (
        initials(seller.name)
      )}
    </span>
  );
}
