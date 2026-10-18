import { offerKinds, type OfferKind } from "@/features/offers/offer";

/** What the home's address asks for: `?q=` words, `?kind=` one kind, `?now=1` collectable now. */
export type HomeQuery = { q?: string; kind?: OfferKind; now?: boolean };

export function readHomeQuery(params: Record<string, string | string[] | undefined>): HomeQuery {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const q = first(params.q)?.trim();
  const kind = first(params.kind);
  return {
    q: q || undefined,
    kind: offerKinds.find((known) => known === kind),
    now: first(params.now) === "1" || undefined,
  };
}
