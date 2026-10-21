import { Link } from "@/i18n/navigation";

import { dishHref, type OfferSummary } from "./offer";

// A dish's name as the way to it on its seller's page (Figma K4), stretched over its whole card, which must be
// positioned. The card's own buttons, such as the heart, sit above it.
export function DishLink({
  offer,
  children,
}: {
  offer: Pick<OfferSummary, "id" | "sellerId">;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={dishHref(offer)}
      className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-3 focus-visible:after:ring-ring focus-visible:after:ring-inset"
    >
      {children}
    </Link>
  );
}

// A seller's name as the way to their page (Figma K4b "Xem quán"), above a card's stretched dish link, at
// least 24px tall so it stays a target of its own beside it (WCAG 2.5.8).
export function SellerLink({
  sellerId,
  children,
}: {
  sellerId: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/sellers/${sellerId}`}
      className="relative z-10 inline-flex min-h-6 items-center hover:underline focus-visible:underline focus-visible:outline-none"
    >
      {children}
    </Link>
  );
}
