"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { quantityOf } from "@/features/cart/cart";
import { useCart } from "@/features/cart/cart-store";
import { QuantityStepper } from "@/features/cart/quantity-stepper";
import { cn } from "@/lib/utils";

import { DiscountBadge } from "./discount-label";
import { DishSheet } from "./dish-sheet";
import { formatPrice } from "./format";
import { dishAnchor, kindsByCount, type OfferSummary } from "./offer";
import { OfferPhoto } from "./offer-photo";

const DEEPEST = 4;
// Where a section counts as reached: the tabs' height and a little air above the section's heading.
const REACHED_PX = 120;

/** The anchor of a dish's card in the wide menu; the phone's row keeps `dishAnchor`, the one a dish link names. */
function wideDishAnchor(offerId: string): string {
  return `wide-${dishAnchor(offerId)}`;
}

type Section = { id: string; title: string; offers: readonly OfferSummary[] };

// The seller's menu from 768px (Figma "01 · Trang quán & giỏ nhiều quán · đầy đủ"): a row of pill links, one for each
// section, the one scrolled to filled in Tasco blue, over the sections, each a heading over its dishes' white cards
// two abreast. "Giảm sâu" holds the four deepest discounts when there are more dishes than that; the kinds follow,
// largest first. Figma's "Bán chạy" has no backend. A dish shows once, so its cart controls and anchor are unique:
// the deep discounts leave their kind's section. The dish a link led to (`focused`) is ringed and scrolled to.
export function SellerMenu({
  offers,
  focused,
}: {
  offers: readonly OfferSummary[];
  focused?: string;
}) {
  const t = useTranslations("Seller");
  const kinds = useTranslations("OfferKind");
  const sections = menuSections(offers, t("deepDiscount"), (kind) => kinds(kind));
  const ids = sections.map(({ id }) => id).join(" ");
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    if (focused) document.getElementById(wideDishAnchor(focused))?.scrollIntoView();
  }, [focused]);

  useEffect(() => {
    const order = ids.split(" ");
    function onScroll() {
      const reached = order.filter(
        (id) =>
          (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= REACHED_PX,
      );
      setActive(reached.at(-1) ?? order[0]);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  return (
    <div id="dishes" className="hidden flex-col gap-6 md:flex">
      {sections.length > 1 && (
        <nav aria-label={t("kinds")} className="scrollbar-none overflow-x-auto">
          <ul className="flex min-w-max gap-2.5">
            {sections.map(({ id, title }) => (
              <li key={id} className="flex-1">
                <a
                  href={`#${id}`}
                  onClick={() => setActive(id)}
                  aria-current={id === active ? "location" : undefined}
                  className={cn(
                    "flex h-11 items-center justify-center rounded-full px-4 text-body-sm-strong whitespace-nowrap focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
                    id === active
                      ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                      : "bg-card text-foreground hover:bg-secondary",
                  )}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="flex flex-col gap-7">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="flex scroll-mt-6 flex-col gap-3"
          >
            <h2 id={`${section.id}-title`} className="text-card-title text-foreground">
              {section.title}
            </h2>
            <ul className="grid grid-cols-2 gap-4">
              {section.offers.map((offer) => (
                <li key={offer.id} className="min-w-0">
                  <DishCard offer={offer} focused={offer.id === focused} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function menuSections(
  offers: readonly OfferSummary[],
  deepTitle: string,
  kindTitle: (kind: OfferSummary["kind"]) => string,
): Section[] {
  const deepest =
    offers.length > DEEPEST
      ? offers.toSorted((a, b) => b.discountPercent - a.discountPercent).slice(0, DEEPEST)
      : [];
  const deepIds = new Set(deepest.map(({ id }) => id));
  const rest = offers.filter(({ id }) => !deepIds.has(id));
  return [
    ...(deepest.length > 0 ? [{ id: "deep-discount", title: deepTitle, offers: deepest }] : []),
    ...kindsByCount(rest).map(({ kind }) => ({
      id: `kind-${kind}`,
      title: kindTitle(kind),
      offers: rest.filter((offer) => offer.kind === kind),
    })),
  ];
}

// A dish's white card (Figma "món", 144px high): its 112px photograph with the discount at the top left and the
// portions left at the bottom left, the name over the price and the original price, and the − and + at the bottom
// right. The photograph and the name open the dish's sheet.
function DishCard({ offer, focused }: { offer: OfferSummary; focused: boolean }) {
  const t = useTranslations("OfferCard");
  const [open, setOpen] = useState(false);
  const original = formatPrice(offer.originalPriceVnd);

  return (
    <article
      id={wideDishAnchor(offer.id)}
      className={cn(
        "flex h-36 scroll-mt-20 items-center gap-3 rounded-md bg-card p-4",
        focused && "ring-2 ring-primary",
      )}
    >
      <div className="relative size-28 shrink-0 overflow-hidden rounded-md bg-muted">
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={() => setOpen(true)}
          className="absolute inset-0"
        >
          <OfferPhoto offer={offer} sizes="112px" />
          <DiscountBadge percent={offer.discountPercent} />
        </button>
        <StockLabel offer={offer} />
      </div>
      <div className="flex h-full min-w-0 flex-1 flex-col justify-between">
        <h3 className="line-clamp-2 text-body-sm-strong text-foreground">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-left focus-visible:underline focus-visible:outline-none"
          >
            {offer.name}
          </button>
        </h3>
        <div className="flex items-end justify-between gap-2">
          <p className="flex min-w-0 flex-col">
            <span className="font-display text-price-lg text-primary">
              {formatPrice(offer.priceVnd)}
            </span>
            <s aria-hidden className="text-label text-muted-foreground">
              {original}
            </s>
            <span className="sr-only">{t("originalPrice", { price: original })}</span>
          </p>
          <div className="flex w-24 shrink-0 justify-end">
            <QuantityStepper offer={offer} />
          </div>
        </div>
      </div>
      <DishSheet offer={offer} open={open} onOpenChange={setOpen} />
    </article>
  );
}

// "Chỉ còn 4" at the photograph's bottom left, "Đã chọn đủ 4" once the cart holds every portion left.
function StockLabel({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("Cart");
  const full = quantityOf(useCart(), offer.id) >= offer.unitsLeft;

  return (
    <span className="absolute bottom-1.5 left-1.5 rounded-sm bg-fresh px-2 py-0.5 text-label-strong text-fresh-foreground">
      {t(full ? "stockChosen" : "stockLeft", { units: offer.unitsLeft })}
    </span>
  );
}
