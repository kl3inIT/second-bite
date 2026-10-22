import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

import { Marquee } from "@/components/marquee";
import { kindPictures as pictures } from "@/features/offers/kind-pictures";
import cakes from "@/features/offers/kinds/cakes.jpg";
import fruit from "@/features/offers/kinds/fruit.jpg";
import noodles from "@/features/offers/kinds/noodles.jpg";
import pho from "@/features/offers/kinds/pho.jpg";
import sushi from "@/features/offers/kinds/sushi.jpg";
import vegetables from "@/features/offers/kinds/vegetables.jpg";
import type { OfferKind } from "@/features/offers/offer";
import { Link } from "@/i18n/navigation";
import { searchHref } from "@/features/search/search-query";

import { homePath, type HomeQuery } from "./home-query";

// The round pictures at the top of the content (Figma K1 kind picker): first one per kind the API can filter
// by, each a link over the address, the chosen one linking back to the whole list; then dishes people look
// for (Figma WK1 kind picker), each a search for its words. When they do not fit, on a phone or a desktop, the
// row runs on its own. Collecting now is a chip of the search (Figma K2).
// In Figma's order (its layers are named after the kinds, kind/Bánh…), each a dish of a Tasco Mall shop.
const order: readonly OfferKind[] = [
  "bakery",
  "prepared_food",
  "mixed_box",
  "ingredients",
  "drinks",
  "other",
];
// The words searched are the dishes' Vietnamese names, as the offers are named, whatever the language shown.
const dishes = [
  { key: "pho", words: "phở", picture: pho },
  { key: "noodles", words: "mì", picture: noodles },
  { key: "sushi", words: "sushi", picture: sushi },
  { key: "cakes", words: "bánh ngọt", picture: cakes },
  { key: "vegetables", words: "rau", picture: vegetables },
  { key: "fruit", words: "trái cây", picture: fruit },
] as const;

export function KindPicker({ query }: { query: HomeQuery }) {
  const t = useTranslations("Home");
  const kinds = useTranslations("OfferKind");
  // A kind narrows the place being shown; it does not move back to Tasco Mall.
  const { near } = query;
  const items = [
    ...order.map((kind) => ({
      key: kind,
      label: kinds(kind),
      picture: pictures[kind],
      active: query.kind === kind,
      href: homePath({ near, kind: query.kind === kind ? undefined : kind }),
    })),
    ...dishes.map((dish) => ({
      key: dish.key,
      label: t(`dishes.${dish.key}`),
      picture: dish.picture,
      active: false,
      href: searchHref({ near, q: dish.words }),
    })),
  ];

  return (
    <nav aria-label={t("kindsLabel")} className="flex px-4">
      <Marquee
        label={t("kindsLabel")}
        count={items.length}
        spacing={{ gap: "gap-2.5 md:gap-6", seam: "pr-2.5 md:pr-6" }}
      >
        {items.map((item) => (
          <li key={item.key} className="shrink-0 py-1.5">
            <Link
              href={item.href}
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
      </Marquee>
    </nav>
  );
}

function KindPicture({ picture, active }: { picture: StaticImageData; active: boolean }) {
  const frame = cn(
    "size-15 rounded-full transition-shadow md:size-20 group-hover/kind:ring-2 group-hover/kind:ring-secondary-hover",
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
