import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";

import { formatPrice } from "@/features/offers/format";
import type { OfferBody } from "@/lib/api/generated";

// One post of a store (Figma Q2, S1, S2): its photo, its name, and one line of where it stands, with what the
// person can do beside it. The line depends on the status: on sale and sold out say the window and the units
// left, over says what sold, withdrawn only the price.
export async function PostRow({ offer, action }: { offer: OfferBody; action?: React.ReactNode }) {
  const [t, format] = await Promise.all([getTranslations("PostRow"), getFormatter()]);
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const price = formatPrice(offer.priceVnd);
  const window = { from: time(offer.windowStart), until: time(offer.windowEnd) };
  const quantity = { left: offer.unitsLeft, units: offer.units, unit: offer.unit };

  let line: string;
  switch (offer.status) {
    case "on_sale":
      line = t("onSale", { ...window, ...quantity, price });
      break;
    case "sold_out":
      line = t("soldOut", { ...window, ...quantity, price });
      break;
    case "withdrawn":
      line = t("withdrawn", { price });
      break;
    default:
      line = t("closed", { ...quantity, sold: offer.units - offer.unitsLeft, price });
  }

  return (
    <li className="flex items-center gap-3 border-b border-border py-4 last:border-b-0 last:pb-0 md:gap-4">
      <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={`/api${offer.photo.smallPath}`}
          alt=""
          fill
          sizes="56px"
          unoptimized
          className="object-cover"
        />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="text-title-lg md:truncate">{offer.name}</h3>
        <p className="text-body-sm text-muted-foreground">{line}</p>
      </div>
      {action}
    </li>
  );
}
