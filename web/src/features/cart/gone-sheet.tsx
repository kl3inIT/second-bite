"use client";

import { useTranslations } from "next-intl";

import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { formatPrice } from "@/features/offers/format";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@/i18n/navigation";

import { totals, withBasket, type Basket, type Cart, type CutLine } from "./cart";

// The dishes someone else ordered first (Figma O7, WK5b), gone or with fewer portions left than the cart held:
// nothing was charged, then order what is left in one press
// or look at the seller's other dishes. Either way, and on closing, the cart keeps only what is left. A sheet
// from the foot on a phone, a dialog in the middle from 768px, where the press names how many orders it places.
export function GoneSheet({
  cart,
  cut,
  rest,
  seller,
  onKeep,
  onOrderRest,
}: {
  cart: Cart;
  cut: CutLine[];
  rest: Basket | null;
  seller: Basket["seller"];
  onKeep: () => void;
  onOrderRest: (rest: Basket) => void;
}) {
  const t = useTranslations("Cart");
  const phone = useIsMobile();
  const gone = cut.filter(({ left }) => left === 0);
  const title =
    gone.length === 1
      ? t("goneOne", { name: gone[0].name })
      : gone.length > 1
        ? t("goneMany", { count: gone.length })
        : cut.length === 1
          ? t("fewerOne", { name: cut[0].name, left: cut[0].left })
          : t("fewerMany", { count: cut.length });
  const afterRest = withBasket(cart, seller.id, rest);
  const body = t(gone.length > 0 ? "goneBody" : "fewerBody");
  const actions = (
    <div className="flex flex-col gap-2 pt-2">
      {rest && (
        <Button size="lg" onClick={() => onOrderRest(rest)}>
          {phone
            ? t("orderRest", {
                what:
                  rest.lines.length === 1
                    ? t("line", { quantity: rest.lines[0].quantity, name: rest.lines[0].name })
                    : t("restUnits", { units: totals(rest).units }),
                price: formatPrice(totals(rest).priceVnd),
              })
            : t("orderWithout", {
                orders: afterRest?.baskets.length ?? 0,
                price: formatPrice(afterRest ? totals(afterRest).priceVnd : 0),
              })}
        </Button>
      )}
      <Link
        href={`/sellers/${seller.id}`}
        onClick={onKeep}
        className={buttonVariants({
          variant: phone ? "secondary" : "ghost",
          size: phone ? "lg" : "default",
        })}
      >
        {t("otherDishes")}
      </Link>
    </div>
  );

  return phone ? (
    <Drawer open onOpenChange={(open) => !open && onKeep()}>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 pt-5 pb-6">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{body}</DrawerDescription>
          {actions}
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open onOpenChange={(open) => !open && onKeep()}>
      <DialogContent showCloseButton={false} className="sm:max-w-115">
        <div className="flex flex-col gap-3.5 px-3 pt-3 pb-2 text-center">
          <DialogTitle size="headline">{title}</DialogTitle>
          <DialogDescription>
            {gone.length > 0 ? t("goneBodySeller", { seller: seller.name }) : body}
          </DialogDescription>
          {actions}
        </div>
      </DialogContent>
    </Dialog>
  );
}
