"use client";

import { useTranslations } from "next-intl";

import { Button, buttonVariants } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";

import { totals, type Basket, type CutLine } from "./cart";

// The dishes someone else ordered first (Figma O7), gone or with fewer portions left than the cart held:
// nothing was charged, then order what is left in one press
// or look at the seller's other dishes. Either way, and on closing, the cart keeps only what is left.
export function GoneSheet({
  cut,
  rest,
  sellerId,
  onKeep,
  onOrderRest,
}: {
  cut: CutLine[];
  rest: Basket | null;
  sellerId: string;
  onKeep: () => void;
  onOrderRest: (rest: Basket) => void;
}) {
  const t = useTranslations("Cart");
  const gone = cut.filter(({ left }) => left === 0);
  const title =
    gone.length === 1
      ? t("goneOne", { name: gone[0].name })
      : gone.length > 1
        ? t("goneMany", { count: gone.length })
        : cut.length === 1
          ? t("fewerOne", { name: cut[0].name, left: cut[0].left })
          : t("fewerMany", { count: cut.length });

  return (
    <Drawer open onOpenChange={(open) => !open && onKeep()}>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 pt-5 pb-6">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{t(gone.length > 0 ? "goneBody" : "fewerBody")}</DrawerDescription>
          <div className="flex flex-col gap-2 pt-2">
            {rest && (
              <Button size="lg" onClick={() => onOrderRest(rest)}>
                {t("orderRest", {
                  what:
                    rest.lines.length === 1
                      ? t("line", { quantity: rest.lines[0].quantity, name: rest.lines[0].name })
                      : t("restUnits", { units: totals(rest).units }),
                  price: formatPrice(totals(rest).priceVnd),
                })}
              </Button>
            )}
            <Link
              href={`/sellers/${sellerId}`}
              onClick={onKeep}
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              {t("otherDishes")}
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
