"use client";

import { useState, useTransition } from "react";

import { useRouter } from "@/i18n/navigation";
import { ApiError, failureOf } from "@/lib/api/client";
import { getOffer, placeOrder } from "@/lib/api/generated";

import { keepLeft, type Cart, type CutLine } from "./cart";
import { saveCart } from "./cart-store";

/** Why the cart was not ordered: dishes someone else took first (Figma O7), or anything else in the server's words. */
type PlaceProblem =
  | { kind: "gone"; cut: CutLine[]; rest: Cart | null }
  | { kind: "failed"; detail?: string; reference?: string };

const GONE = new Set(["ORDER_OFFER_SOLD_OUT", "ORDER_OFFER_UNAVAILABLE"]);

/** Each dish's portions on sale now; a dish that cannot be read counts as gone. */
async function portionsLeft(cart: Cart): Promise<Record<string, number>> {
  const read = await Promise.all(
    cart.lines.map(async ({ id }) => {
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

// Orders the whole cart at once (SEC-15 › POST /orders) and opens the order. One key per visit goes with
// every press, so a second press or a retried request returns the order placed first; a refused order
// writes nothing, so the same key orders what is left after O7. When a dish ran out, the answer does not
// say which, so the dishes are read again to name them; when none is short (the seller closed, or the
// portions came back) the server's own words say why.
export function usePlaceCart() {
  const router = useRouter();
  const [key] = useState(() => crypto.randomUUID());
  const [problem, setProblem] = useState<PlaceProblem>();
  const [pending, startTransition] = useTransition();

  function place(cart: Cart) {
    setProblem(undefined);
    startTransition(async () => {
      try {
        const { data } = await placeOrder({
          headers: { "Idempotency-Key": key },
          body: { lines: cart.lines.map(({ id, quantity }) => ({ offerId: id, units: quantity })) },
        });
        router.push(`/orders/${data.id}`);
        saveCart(null);
      } catch (error) {
        if (error instanceof ApiError && GONE.has(error.code ?? "")) {
          const { cart: rest, cut } = keepLeft(cart, await portionsLeft(cart));
          if (cut.length > 0) {
            setProblem({ kind: "gone", cut, rest });
            return;
          }
        }
        setProblem({ kind: "failed", ...failureOf(error) });
      }
    });
  }

  return { place, pending, problem, dismiss: () => setProblem(undefined) };
}
