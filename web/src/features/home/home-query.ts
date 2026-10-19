import { offerKinds, type OfferKind } from "@/features/offers/offer";

/** What the home's address asks for: `?q=` words, `?kind=` one kind, `?now=1` collectable now. */
export type HomeQuery = { q?: string; kind?: OfferKind; now?: boolean };

/** The home's address for a query, as sign-in's `returnTo`. */
export function homePath(query: HomeQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.kind) params.set("kind", query.kind);
  if (query.now) params.set("now", "1");
  const search = params.toString();
  return search ? `/?${search}` : "/";
}

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
