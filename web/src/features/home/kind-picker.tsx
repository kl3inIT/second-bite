import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

import { ScrollRow } from "@/components/scroll-row";
import type { OfferKind } from "@/features/offers/offer";
import { Link } from "@/i18n/navigation";

import bakery from "./kinds/bakery.jpg";
import drinks from "./kinds/drinks.jpg";
import ingredients from "./kinds/ingredients.jpg";
import mixedBox from "./kinds/mixed-box.jpg";
import other from "./kinds/other.jpg";
import preparedFood from "./kinds/prepared-food.jpg";

import type { HomeQuery } from "./home-query";

// The round pictures at the top of the content (Figma K1 kind picker): one per kind the API can filter by,
// with a short scroll hint under them. On a wide screen they are larger. Each is a link over the address; the chosen one links back to the
// whole list. Collecting now is a chip of the search (Figma K2).
// In Figma's order (its layers are named after the kinds, kind/Bánh…), each a dish of a Tasco Mall shop.
const order: readonly OfferKind[] = [
  "bakery",
  "prepared_food",
  "mixed_box",
  "ingredients",
  "drinks",
  "other",
];
const pictures: Record<OfferKind, StaticImageData> = {
  bakery,
  prepared_food: preparedFood,
  ingredients,
  drinks,
  mixed_box: mixedBox,
  other,
};

export function KindPicker({ query }: { query: HomeQuery }) {
  const t = useTranslations("Home");
  const kinds = useTranslations("OfferKind");
  // A kind narrows the place being shown; it does not move back to Tasco Mall.
  const keep = query.near ? { near: query.near } : {};
  const items = order.map((kind) => ({
    key: kind,
    label: kinds(kind),
    picture: pictures[kind],
    active: query.kind === kind,
    href: { kind },
  }));

  return (
    <nav aria-label={t("kindsLabel")} className="flex flex-col gap-1">
      <ScrollRow hint label={t("kindsLabel")} className="gap-2.5 py-1.5 sm:justify-start lg:gap-6">
        {items.map((item) => (
          <li key={item.key} className="shrink-0 snap-start">
            <Link
              href={{ pathname: "/", query: item.active ? keep : { ...keep, ...item.href } }}
              aria-current={item.active ? "page" : undefined}
              className="group/kind flex min-w-16 flex-col items-center gap-1.5 rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <KindPicture picture={item.picture} active={item.active} />
              <span
                className={cn(
                  "text-center whitespace-nowrap",
                  item.active ? "text-label-strong text-primary" : "text-label text-foreground",
                )}
              >
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ScrollRow>
    </nav>
  );
}

function KindPicture({ picture, active }: { picture: StaticImageData; active: boolean }) {
  const frame = cn(
    "size-15 rounded-full transition-shadow lg:size-20 group-hover/kind:ring-2 group-hover/kind:ring-secondary-hover",
    active &&
      "ring-3 ring-primary ring-offset-2 ring-offset-background group-hover/kind:ring-primary",
  );
  return (
    <Image
      src={picture}
      alt=""
      sizes="(min-width: 1024px) 80px, 60px"
      className={cn(frame, "object-cover")}
    />
  );
}
