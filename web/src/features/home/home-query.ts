import type { OfferKind } from "@/features/offers/offer";

import {
  defined,
  loadHomeSearchParams,
  nullable,
  serializeHomeSearchParams,
} from "./search-params";

/**
 * What the home's address asks for: `?q=` words, `?kind=` one kind, `?now=1` collectable now, and
 * `?near=21.057,105.896` the person's own place instead of Tasco Mall (Figma K1a). The keys are read and written
 * with nuqs (`search-params.ts`).
 */
export type HomeQuery = { q?: string; kind?: OfferKind; now?: boolean; near?: string };

export function readHomeQuery(params: Record<string, string | string[] | undefined>): HomeQuery {
  const { q, kind, now, near } = defined(loadHomeSearchParams(params));
  return { q, kind, now, near };
}

/** The home's address for a query, as a link's and sign-in's `returnTo`. */
export function homePath(query: HomeQuery): string {
  return `/${serializeHomeSearchParams(nullable(query))}`;
}
