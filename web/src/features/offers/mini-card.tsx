import { ClockIcon } from "lucide-react";

import type { OfferSummary } from "./offer";
import { OfferPhoto } from "./offer-photo";

// The small card of the home's rows "Sắp có tối nay" and "Gợi ý cho bạn" (Figma rec/…): a 96px photograph
// with a label in its corner and, at its foot, a badge on the left and an action on the right; then the dish
// and one line beside a clock, the window or the time it goes on sale.
export function MiniCard({
  offer,
  label,
  badge,
  action,
  meta,
}: {
  offer: Pick<OfferSummary, "name" | "photo">;
  label: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  meta: string;
}) {
  return (
    <article className="flex w-33 flex-col gap-0.5">
      <div className="relative mb-1.5 h-24 overflow-hidden rounded-lg">
        <OfferPhoto offer={offer} sizes="132px" />
        {label}
        {badge && <div className="absolute bottom-1.5 left-1.5">{badge}</div>}
        {action && <div className="absolute right-1.5 bottom-1.5">{action}</div>}
      </div>
      <h3 className="truncate text-body-sm-strong text-foreground">{offer.name}</h3>
      <p className="flex items-center gap-1.5 text-label text-muted-foreground">
        <ClockIcon aria-hidden strokeWidth={2.2} className="size-3.5 shrink-0" />
        <span className="truncate">{meta}</span>
      </p>
    </article>
  );
}
