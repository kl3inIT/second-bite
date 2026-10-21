"use client";

import { useRef, useState, useTransition } from "react";

import { keepOrder } from "@/features/orders/keep-order";
import { useRouter } from "@/i18n/navigation";
import { ApiError, failureOf } from "@/lib/api/client";
import { getOffer, placeOrder } from "@/lib/api/generated";

import { keepLeft, withBasket, type Basket, type Cart, type CutLine } from "./cart";
import { saveCart } from "./cart-store";
import type { Contact } from "./contact";

/** Why a seller's basket was not ordered: dishes someone else took first (Figma O7), or anything else in the server's words. */
type PlaceProblem =
  | { kind: "gone"; sellerId: string; cut: CutLine[]; rest: Basket | null }
  | { kind: "failed"; detail?: string; reference?: string };

const GONE = new Set(["ORDER_OFFER_SOLD_OUT", "ORDER_OFFER_UNAVAILABLE"]);

/** Each dish's portions on sale now; a dish that cannot be read counts as gone. */
async function portionsLeft(basket: Basket): Promise<Record<string, number>> {
  const read = await Promise.all(
    basket.lines.map(async ({ id }) => {
      try {
        const { data } = await getOffer({ path: { offerId: id } });
        return [id, data.status === "on_sale" ? data.unitsLeft : 0] as const;
      } catch {
        return [id, 0] as const;
      }
    }),
  );
  return Object.fromEntries(read);
}

// Orders the cart one seller at a time, since an order holds one seller's dishes (SEC-15 › POST /orders), and
// opens the order, or the list when there are several. Each basket goes with the visit's key and its seller,
// so a second press or a retried request returns the order placed first; a refused order writes nothing, so
// the same key orders what is left after O7. A basket ordered leaves the cart at once, so it is never sent
// again. An order placed without signing in is kept readable in this browser before it is opened, and when
// keeping it fails the basket stays, so trying again returns the same order. When a dish ran out the answer
// does not say which, so the dishes are read again to name them; when none is short (the seller closed, or the
// portions came back) the server's own words say why.
export function usePlaceCart() {
  const router = useRouter();
  const [key] = useState(() => crypto.randomUUID());
  const placed = useRef<string[]>([]);
  const [problem, setProblem] = useState<PlaceProblem>();
  const [pending, startTransition] = useTransition();

  function place(cart: Cart, contact: Contact) {
    setProblem(undefined);
    startTransition(async () => {
      let left: Cart | null = cart;
      for (const basket of cart.baskets) {
        try {
          const { data } = await placeOrder({
            headers: { "Idempotency-Key": `${key}:${basket.seller.id}` },
            body: {
              lines: basket.lines.map(({ id, quantity }) => ({ offerId: id, units: quantity })),
              ...contact,
              checkoutId: key,
            },
          });
          if (data.access) await keepOrder(data.id, data.access);
          placed.current.push(data.id);
          left = left && withBasket(left, basket.seller.id, null);
          saveCart(left);
        } catch (error) {
          if (error instanceof ApiError && GONE.has(error.code ?? "")) {
            const { basket: rest, cut } = keepLeft(basket, await portionsLeft(basket));
            if (cut.length > 0) {
              setProblem({ kind: "gone", sellerId: basket.seller.id, cut, rest });
              return;
            }
          }
          setProblem({ kind: "failed", ...failureOf(error) });
          return;
        }
      }
      // The orders of one cart share the visit's key as their checkout, so the first opens them all.
      router.push(`/orders/${placed.current[0]}`);
    });
  }

  return { place, pending, problem, dismiss: () => setProblem(undefined) };
}
