import { Link } from "@/i18n/navigation";

// A dish's name as the way to its page (Figma K4), stretched over its whole card, which must be positioned.
// The card's own buttons, such as the heart, sit above it.
export function DishLink({ offerId, children }: { offerId: string; children: React.ReactNode }) {
  return (
    <Link
      href={`/offers/${offerId}`}
      className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-3 focus-visible:after:ring-ring focus-visible:after:ring-inset"
    >
      {children}
    </Link>
  );
}

// A seller's name as the way to their page (Figma K4b "Xem quán"), above a card's stretched dish link.
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
      className="relative z-10 hover:underline focus-visible:underline focus-visible:outline-none"
    >
      {children}
    </Link>
  );
}
