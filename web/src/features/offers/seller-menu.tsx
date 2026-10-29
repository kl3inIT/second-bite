"use client";

import { FlameIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { quantityOf } from "@/features/cart/cart";
import { useCart } from "@/features/cart/cart-store";
import { QuantityStepper } from "@/features/cart/quantity-stepper";
import { cn } from "@/lib/utils";

import { DiscountBadge } from "./discount-label";
import { DishSheet } from "./dish-sheet";
import { formatPrice } from "./format";
import { dishAnchor, kindsByCount, type OfferSummary } from "./offer";
import { OfferPhoto } from "./offer-photo";

// How many dishes "Bán chạy" and "Giảm sâu" hold.
const PICKED = 4;
// Where a section counts as reached: the tabs' height and a little air above the section's heading.
const REACHED_PX = 120;

/** The anchor of a dish's card in the wide menu; the phone's row keeps `dishAnchor`, the one a dish link names. */
function wideDishAnchor(offerId: string): string {
  return `wide-${dishAnchor(offerId)}`;
}

type Section = { id: string; title: string; offers: readonly OfferSummary[] };

/** The portions of tonight's post already ordered: what "Bán chạy" ranks by and "Đã bán" says. */
function ordered(offer: OfferSummary): number {
  return offer.units - offer.unitsLeft;
}

// The seller's menu from 768px (Figma "01 · Trang quán & giỏ nhiều quán · đầy đủ"): a row of pill links, one for each
// section, the one scrolled to filled in Tasco blue, over the sections, each a heading over its dishes' white cards
// two abreast. Two sections lead: "Bán chạy", the four dishes with the most portions ordered tonight (only those with
// one at least, so a store that has sold nothing yet has none), and "Giảm sâu", the four deepest discounts; the kinds follow, largest first, each with all its dishes, as Figma repeats
// a dish there. Only the kind section's card carries the dish's anchor. The dish a link led to (`focused`) is scrolled
// to and ringed until the first press or key, then looks like the others.
export function SellerMenu({
  offers,
  focused,
}: {
  offers: readonly OfferSummary[];
  focused?: string;
}) {
  const t = useTranslations("Seller");
  const kinds = useTranslations("OfferKind");
  const sections = menuSections(offers, t("bestSellers"), t("deepDiscount"), (kind) => kinds(kind));
  const ids = sections.map(({ id }) => id).join(" ");
  const [active, setActive] = useState(sections[0]?.id);
  const [ringed, setRinged] = useState(focused);
  // The section whose pill was just pressed: it stays filled while the page scrolls to it, even when the page ends
  // before its heading reaches the tabs, until the buyer scrolls on their own.
  const pressed = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!ringed) return;
    const clear = () => setRinged(undefined);
    document.addEventListener("pointerdown", clear, { once: true });
    document.addEventListener("keydown", clear, { once: true });
    return () => {
      document.removeEventListener("pointerdown", clear);
      document.removeEventListener("keydown", clear);
    };
  }, [ringed]);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    if (focused) document.getElementById(wideDishAnchor(focused))?.scrollIntoView();
  }, [focused]);

  useEffect(() => {
    const order = ids.split(" ");
    function onScroll() {
      if (pressed.current) return;
      const reached = order.filter(
        (id) =>
          (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= REACHED_PX,
      );
      setActive(reached.at(-1) ?? order[0]);
    }
    function release() {
      pressed.current = undefined;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    for (const type of ["wheel", "touchstart", "keydown"]) {
      window.addEventListener(type, release, { passive: true });
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      for (const type of ["wheel", "touchstart", "keydown"]) {
        window.removeEventListener(type, release);
      }
    };
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
                  onClick={() => {
                    pressed.current = id;
                    setActive(id);
                  }}
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
                  <DishCard
                    offer={offer}
                    anchored={section.id.startsWith("kind-")}
                    ringed={section.id.startsWith("kind-") && offer.id === ringed}
                  />
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
  bestTitle: string,
  deepTitle: string,
  kindTitle: (kind: OfferSummary["kind"]) => string,
): Section[] {
  return [
    {
      id: "best-sellers",
      title: bestTitle,
      offers: offers
        .filter((offer) => ordered(offer) > 0)
        .toSorted((a, b) => ordered(b) - ordered(a))
        .slice(0, PICKED),
    },
    {
      id: "deep-discount",
      title: deepTitle,
      offers: offers.toSorted((a, b) => b.discountPercent - a.discountPercent).slice(0, PICKED),
    },
    ...kindsByCount(offers).map(({ kind }) => ({
      id: `kind-${kind}`,
      title: kindTitle(kind),
      offers: offers.filter((offer) => offer.kind === kind),
    })),
  ].filter((section) => section.offers.length > 0);
}

// A dish's white card (Figma "món", 144px high): its 112px photograph with the discount at the top left and the
// portions left at the bottom left, the name over the price and the original price, and the − and + at the bottom
// right. The photograph and the name open the dish's sheet.
function DishCard({
  offer,
  anchored,
  ringed,
}: {
  offer: OfferSummary;
  anchored: boolean;
  ringed: boolean;
}) {
  const t = useTranslations("OfferCard");
  const [open, setOpen] = useState(false);
  const original = formatPrice(offer.originalPriceVnd);

  return (
    <article
      id={anchored ? wideDishAnchor(offer.id) : undefined}
      className={cn(
        "flex h-36 scroll-mt-20 items-center gap-3 rounded-md bg-card p-4",
        ringed && "ring-2 ring-primary",
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
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="line-clamp-2 text-body-sm-strong wrap-break-word text-foreground">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-left focus-visible:underline focus-visible:outline-none"
            >
              {offer.name}
            </button>
          </h3>
          <SoldLine offer={offer} />
        </div>
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

// "Đã bán 6" under the name, with a flame, once tonight's post has portions ordered; nothing before the first.
function SoldLine({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("Seller");
  const sold = ordered(offer);
  if (sold < 1) return null;

  return (
    <p className="flex items-center gap-1 text-label-strong text-sale">
      <FlameIcon aria-hidden className="size-3.5 shrink-0" />
      {t("sold", { units: sold })}
    </p>
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
