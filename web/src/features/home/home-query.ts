import type { OfferKind } from "@/features/offers/offer";

import {
  defined,
  loadHomeSearchParams,
  nullable,
  serializeHomeSearchParams,
} from "./search-params";

/**
 * What the home's address asks for: `?q=` words, `?kind=` one kind, `?now=1` collectable now,
 * `?near=21.057,105.896` a place instead of every shop (Figma K1a), and `?place=` that place's name when it has
 * one. The keys are read and written with nuqs (`search-params.ts`).
 */
export type HomeQuery = {
  q?: string;
  kind?: OfferKind;
  now?: boolean;
  near?: string;
  place?: string;
};

export function readHomeQuery(params: Record<string, string | string[] | undefined>): HomeQuery {
  const { q, kind, now, near, place } = defined(loadHomeSearchParams(params));
  // A name means something only with its point.
  return { q, kind, now, near, place: near ? place : undefined };
}

/** The home's address for a query, as a link's and sign-in's `returnTo`. */
export function homePath(query: HomeQuery): string {
  return `/${serializeHomeSearchParams(nullable(query))}`;
}
