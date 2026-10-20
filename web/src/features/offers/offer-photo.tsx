import Image from "next/image";

import { cn } from "@/lib/utils";

import type { OfferSummary } from "./offer";

// An offer's photograph filling its frame, which sets its size and corners; faded once it has sold out.
export function OfferPhoto({
  offer,
  dimmed = false,
  sizes,
  className,
}: {
  offer: Pick<OfferSummary, "photo">;
  dimmed?: boolean;
  /** How wide the frame is drawn, for the browser to pick its source. */
  sizes: string;
  className?: string;
}) {
  return (
    <Image
      src={`/api${offer.photo.smallPath}`}
      alt=""
      fill
      sizes={sizes}
      // The backend already writes each photo at 400 px without metadata.
      unoptimized
      className={cn("object-cover", dimmed && "opacity-45", className)}
    />
  );
}
