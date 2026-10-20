import { offerKinds, type OfferKind } from "@/features/offers/offer";

/**
 * What the home's address asks for: `?q=` words, `?kind=` one kind, `?now=1` collectable now, and
 * `?near=21.057,105.896` the person's own place instead of Tasco Mall (Figma K1a).
 */
export type HomeQuery = { q?: string; kind?: OfferKind; now?: boolean; near?: string };

// "latitude,longitude" in decimal degrees, as `GET /offers` takes `near`.
const point = /^-?\d{1,2}(\.\d{1,6})?,-?\d{1,3}(\.\d{1,6})?$/;

/** The address's query for a home query, kept by the kinds, the search and the area. */
export function homeSearch(query: HomeQuery): Record<string, string> {
  return Object.fromEntries(
    Object.entries({
      q: query.q,
      kind: query.kind,
      now: query.now ? "1" : undefined,
      near: query.near,
    }).filter((entry): entry is [string, string] => entry[1] !== undefined),
  );
}

/** The home's address for a query, as sign-in's `returnTo`. */
export function homePath(query: HomeQuery): string {
  const search = new URLSearchParams(homeSearch(query)).toString();
  return search ? `/?${search}` : "/";
}

export function readHomeQuery(params: Record<string, string | string[] | undefined>): HomeQuery {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const q = first(params.q)?.trim();
  const kind = first(params.kind);
  const near = first(params.near);
  return {
    q: q || undefined,
    kind: offerKinds.find((known) => known === kind),
    now: first(params.now) === "1" || undefined,
    near: near && point.test(near) ? near : undefined,
  };
}
