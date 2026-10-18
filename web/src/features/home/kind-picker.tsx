import { cn } from "cn";
import { ClockIcon, UtensilsCrossedIcon, type LucideIcon } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

import { ScrollRow } from "@/components/scroll-row";
import { offerKinds, type OfferKind } from "@/features/offers/offer";
import { Link } from "@/i18n/navigation";

import bakery from "./kinds/bakery.jpg";
import drinks from "./kinds/drinks.jpg";
import ingredients from "./kinds/ingredients.jpg";
import mixedBox from "./kinds/mixed-box.jpg";
import preparedFood from "./kinds/prepared-food.jpg";

import type { HomeQuery } from "./home-query";

// The round pictures under the banners (Figma categories): "collect now" and one per kind the API can
// filter by. Each is a link over the address; the chosen one links back to the whole list.
const pictures: Record<OfferKind, StaticImageData | LucideIcon> = {
  bakery,
  prepared_food: preparedFood,
  ingredients,
  drinks,
  mixed_box: mixedBox,
  other: UtensilsCrossedIcon,
};

export function KindPicker({ query }: { query: HomeQuery }) {
  const t = useTranslations("Home");
  const kinds = useTranslations("OfferKind");
  const items = [
    {
      key: "now",
      label: t("collectNow"),
      picture: ClockIcon,
      active: !!query.now,
      href: { now: "1" },
    },
    ...offerKinds.map((kind) => ({
      key: kind,
      label: kinds(kind),
      picture: pictures[kind],
      active: query.kind === kind,
      href: { kind },
    })),
  ];

  return (
    <nav aria-label={t("kindsLabel")}>
      <ScrollRow label={t("kindsLabel")} className="gap-2.5 sm:justify-start">
        {items.map((item) => (
          <li key={item.key} className="shrink-0 snap-start">
            <Link
              href={{ pathname: "/", query: item.active ? {} : item.href }}
              aria-current={item.active ? "page" : undefined}
              className="group/kind flex w-16 flex-col items-center gap-1.5 rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <KindPicture picture={item.picture} active={item.active} />
              <span
                className={cn(
                  "text-center text-caption",
                  item.active ? "font-semibold text-primary" : "font-medium text-soft-foreground",
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

function KindPicture({
  picture,
  active,
}: {
  picture: StaticImageData | LucideIcon;
  active: boolean;
}) {
  const frame = cn(
    "size-15 rounded-full transition-shadow group-hover/kind:ring-2 group-hover/kind:ring-secondary-hover",
    active &&
      "ring-3 ring-primary ring-offset-2 ring-offset-background group-hover/kind:ring-primary",
  );
  if (!("src" in picture)) {
    const Icon = picture;
    return (
      <span className={cn(frame, "flex items-center justify-center bg-secondary text-primary")}>
        <Icon aria-hidden className="size-6" />
      </span>
    );
  }
  return <Image src={picture} alt="" sizes="60px" className={cn(frame, "object-cover")} />;
}
